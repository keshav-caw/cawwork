import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TaskServiceInterface } from '../../common/interfaces/task-service.interface'
import { TaskRepository } from './task.repository'
import dayjs from 'dayjs'
import { ArgumentValidationError } from '../../common/errors/custom-errors/argument-validation.error'
import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { TaskModel } from '../../common/models/task.model'
import { RepeatDurationEnum } from '../../common/enums/repeat-duration.enum'
import { v4 as uuidv4 } from 'uuid'
import { TemplateModel } from '../../common/models/template-model'
import { FamilyMemberService } from '../family-member/family-member.service'
import { FamilyMemberTypes } from '../family-member/family-member.types'
import { defaultTimeSlabs } from '../../common/constants/default-times.constants'
import * as _ from 'lodash'
import { UserService } from '../users/user.service'
import { UserTypes } from '../users/user.types'
import { EmailProvider } from '../utilities/email.provider'
import { UtilityTypes } from '../utilities/utility.types'
import { FamilyMemberActivityModel } from '../../common/models/family-member-activity-model'
import { TimespanHelper } from '../utilities/timespan.helper'
import { ActivityService } from '../activity/activity.service'
import { ActivityTypes } from '../activity/activity.types'

@injectable()
export class TaskService implements TaskServiceInterface {
  days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  constructor(
    @inject('TaskRepository')
    private taskRepository: TaskRepository,
    @inject(FamilyMemberTypes.familyMember)
    private familyMemberService: FamilyMemberService,
    @inject(UserTypes.user) private userService: UserService,
    @inject(UtilityTypes.emailProvider) private emailProvider: EmailProvider,
    @inject(UtilityTypes.timespanHelper) private timespanHelper: TimespanHelper,
    @inject(ActivityTypes.activity) private activityService: ActivityService,
  ) {}

  async getTasksInNextFourteenDays(userId) {
    const taskActivityIdSet = new Set<string>()
    const interval = this.timespanHelper.nextFourteenDays
    const tasks = await this.getTasksByStartAndEndDate(
      userId,
      interval.startDateInUtc,
      interval.endDateInUtc,
    )
    for (const task of tasks) {
      if (task.activityId) {
        taskActivityIdSet.add(task.activityId)
      }
    }
    return taskActivityIdSet
  }

  async getTasksByStartAndEndDate(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<TaskModel[]> {
    return await this.taskRepository.getTasksByStartAndEndDate(
      userId,
      startDate,
      endDate,
    )
  }

  async getTaskDetailsByTaskId(
    taskId: string,
    userId: string,
  ): Promise<TaskModel[]> {
    return await this.taskRepository.getTaskDetailsByTaskId(taskId, userId)
  }

  async getTaskDetailsByTemplateId(
    eventTemplateId: string,
    userId: string,
  ): Promise<TaskModel[]> {
    return await this.taskRepository.getTaskDetailsByTemplateId(
      eventTemplateId,
      userId,
    )
  }

  async getMasterTemplates(): Promise<TemplateModel[]> {
    return await this.taskRepository.getMasterTemplates()
  }

  async getTemplates(userId: string): Promise<TemplateModel[]> {
    return await this.taskRepository.getTemplates(userId)
  }

  async createUserTemplate(
    template: TemplateModel,
    templateId: string,
  ): Promise<TemplateModel[]> {
    template.parentTemplateId = templateId
    this.validateTemplateInfo(template)
    const templateDetails = await this.taskRepository.createTemplate(template)

    return templateDetails
  }

  async updateUserTemplate(
    template: TemplateModel,
    templateId: string,
  ): Promise<TemplateModel[]> {
    this.validateTemplateInfo(template)
    const templateDetails = await this.taskRepository.updateUserTemplate(
      template,
      templateId,
    )

    return templateDetails
  }

  async createTasksByTemplateId(
    tasks: TaskModel[],
    userId: string,
  ): Promise<TaskModel[]> {
    const tasksNeededToBeAdded = await this.validateTemplateTasks(tasks, userId)
    return await this.createTasks(tasksNeededToBeAdded, userId)
  }

  async createTasks(
    tasks: TaskModel[],
    userId: string,
    isUpdateTasks = false,
  ): Promise<TaskModel[]> {
    this.validateTaskInfo(tasks, isUpdateTasks)
    const userDetails = await this.userService.getUserDetail(userId)
    const createTasksInfo = this.createTasksInfo(tasks)
    const recurringTaskId = uuidv4()
    const calls = []

    createTasksInfo.forEach((task) => {
      task.recurringTaskId = !(
        _.isEmpty(task.repeatMode) ||
        task.repeatMode.repeatDuration === RepeatDurationEnum.NONE
      )
        ? recurringTaskId
        : null
      calls.push(this.taskRepository.createTask(task))
    })

    const createdTasks = await Promise.all(calls)
    const emailCalls = []
    const task = createTasksInfo[0]
    if (task?.invites?.length > 0) {
      emailCalls.push(
        this.emailProvider.sendEmailUsingTemplate(
          this.emailProvider.templates.eventTemplateId,
          task.invites,
          task.title,
          {
            text: `Invitation for the ${task.title}`,
            username: userDetails[0].firstName,
          },
        ),
      )
    }
    return createdTasks
  }

  async updateTasks(
    taskId: string,
    taskDetails: TaskModel,
    isAllEvents: boolean,
    isDateUpdated: boolean,
    userId: string,
  ): Promise<TaskModel[]> {
    this.validateTaskInfo([taskDetails], true)
    if (isAllEvents) {
      const taskInfo = await this.taskRepository.getTaskDetailsByTaskId(
        taskId,
        userId,
      )

      if (taskInfo?.length === 0 || !taskInfo) {
        throw new ArgumentValidationError(
          'Unable to edit task. It is already been deleted',
          taskDetails,
          ApiErrorCode.E0104,
        )
      }
      if (!taskDetails.repeatMode) {
        delete taskInfo[0].repeatMode
      }

      if (isDateUpdated) {
        if (
          taskInfo[0].startAtUtc &&
          dayjs(taskInfo[0].startAtUtc).diff(dayjs(), 'minutes') > 0 &&
          dayjs(taskDetails.startAtUtc).diff(dayjs(), 'minutes') < 0
        ) {
          throw new ArgumentValidationError(
            "The start date cannot be less than today's date",
            taskDetails,
            ApiErrorCode.E0105,
          )
        } else if (
          taskInfo[0].endAtUtc &&
          dayjs(taskInfo[0].endAtUtc).diff(dayjs(), 'minutes') > 0 &&
          dayjs(taskDetails.endAtUtc).diff(dayjs(), 'minutes') < 0
        ) {
          throw new ArgumentValidationError(
            "The end date cannot be less than today's date",
            taskDetails,
            ApiErrorCode.E0106,
          )
        }

        if (taskInfo?.length > 0) {
          if (taskInfo[0].recurringTaskId) {
            const today = dayjs().toISOString()
            await this.taskRepository.deleteTaskByRecurringTaskId(
              taskInfo[0].recurringTaskId,
              today,
            )
          } else {
            await this.taskRepository.deleteTask(taskId)
          }
          const keys = Object.keys(taskDetails)
          keys.forEach((key) => {
            taskInfo[0][key] = taskDetails[key]
          })
          delete taskInfo[0]['id']
          delete taskInfo[0]['createdAtUtc']
          delete taskInfo[0]['updatedAtUtc']
          return await this.createTasks(taskInfo, userId, true)
        } else {
          return await this.createTasks([taskDetails], userId, true)
        }
      } else {
        return await this.taskRepository.updateTaskByRecurringTaskId(
          taskDetails,
          taskInfo[0].recurringTaskId,
        )
      }
    } else {
      const taskInfo = await this.taskRepository.getTaskDetailsByTaskId(
        taskId,
        userId,
      )

      if (taskInfo?.length === 0 || !taskInfo) {
        throw new ArgumentValidationError(
          'Unable to edit task. It is already been deleted',
          taskDetails,
          ApiErrorCode.E0104,
        )
      }
      if (!taskDetails.repeatMode) {
        delete taskInfo[0].repeatMode
      }

      if (isDateUpdated) {
        if (
          taskInfo[0].startAtUtc &&
          taskInfo[0].endAtUtc &&
          dayjs(taskInfo[0].startAtUtc).diff(dayjs(), 'minutes') > 0 &&
          dayjs(taskDetails.startAtUtc).diff(dayjs(), 'minutes') < 0
        ) {
          throw new ArgumentValidationError(
            "The start date cannot be less than today's date",
            taskDetails,
            ApiErrorCode.E0105,
          )
        } else if (
          taskInfo[0].endAtUtc &&
          dayjs(taskInfo[0].endAtUtc).diff(dayjs(), 'minutes') > 0 &&
          dayjs(taskDetails.endAtUtc).diff(dayjs(), 'minutes') < 0
        ) {
          throw new ArgumentValidationError(
            "The end date cannot be less than today's date",
            taskDetails,
            ApiErrorCode.E0106,
          )
        }

        await this.taskRepository.deleteTask(taskId)
        if (taskInfo?.length > 0) {
          const keys = Object.keys(taskDetails)
          keys.forEach((key) => {
            taskInfo[0][key] = taskDetails[key]
          })
          delete taskInfo[0]['id']
          delete taskInfo[0]['createdAtUtc']
          delete taskInfo[0]['updatedAtUtc']
          return await this.createTasks(taskInfo, userId, true)
        }
      } else {
        const calls = []
        calls.push(this.taskRepository.updateTaskById(taskDetails, taskId))
        return await Promise.all(calls)
      }
    }
  }

  async deleteTask(taskId: string): Promise<TaskModel> {
    return await this.taskRepository.deleteTask(taskId)
  }

  async deleteTaskByRecurringTaskId(
    recurringTaskId: string,
  ): Promise<TaskModel> {
    const today = dayjs().toISOString()
    return await this.taskRepository.deleteTaskByRecurringTaskId(
      recurringTaskId,
      today,
    )
  }

  async deleteTemplate(
    templateId: string,
    userId: string,
  ): Promise<TaskModel[]> {
    await this.taskRepository.deleteTemplate(templateId)
    return await this.taskRepository.deleteTasksByTemplateId(templateId, userId)
  }

  async deleteTaskByActivityId(
    activityId: string,
    userId: string,
  ): Promise<TaskModel> {
    return await this.taskRepository.deleteTaskByActivityId(activityId, userId)
  }

  async deleteTemplateByFamilyMemberId(
    familyMemberId: string,
    userId: string,
  ): Promise<TaskModel[]> {
    await this.taskRepository.deleteTemplateByFamilyMemberId(
      familyMemberId,
      userId,
    )
    return await this.taskRepository.deleteTasksByFamilyMemberId(
      familyMemberId,
      userId,
    )
  }

  createTasksInfo(tasks) {
    let tasksToBeCreated = []
    let recurringEndDate = null
    tasks.forEach((task: TaskModel) => {
      if (!task.recurringEndAtUtc && task.recurringStartAtUtc) {
        recurringEndDate = dayjs(task.endAtUtc)
          .add(1, 'year')
          .subtract(1, 'day')
          .toISOString()
      } else if (task.recurringStartAtUtc) {
        recurringEndDate = dayjs(task.recurringEndAtUtc).toISOString()
      } else {
        recurringEndDate = dayjs(task.endAtUtc).toISOString()
      }

      if (task.repeatMode?.repeatDuration === RepeatDurationEnum.DAILY) {
        const days = dayjs(recurringEndDate).diff(
          dayjs(task.startAtUtc),
          'days',
        )
        for (let i = 0; i <= days; i++) {
          const start = dayjs(task.startAtUtc).add(i, 'day').toISOString()
          const end = dayjs(task.endAtUtc).add(i, 'day').toISOString()
          const notify = dayjs(task.notifyAtUtc).add(i, 'day').toISOString()
          const taskToBeAdded = JSON.parse(JSON.stringify(task))
          taskToBeAdded.startAtUtc = start
          taskToBeAdded.endAtUtc = end
          taskToBeAdded.notifyAtUtc = notify
          tasksToBeCreated.push(taskToBeAdded)
        }
      } else if (
        task.repeatMode?.repeatDuration === RepeatDurationEnum.MONTHLY
      ) {
        const days = dayjs(recurringEndDate).diff(
          dayjs(task.startAtUtc),
          'months',
        )
        for (let i = 0; i <= days; i++) {
          const start = dayjs(task.startAtUtc).add(i, 'month').toISOString()
          const end = dayjs(task.endAtUtc).add(i, 'month').toISOString()
          const notify = dayjs(task.notifyAtUtc).add(i, 'month').toISOString()
          const taskToBeAdded = JSON.parse(JSON.stringify(task))
          taskToBeAdded.startAtUtc = start
          taskToBeAdded.endAtUtc = end
          taskToBeAdded.notifyAtUtc = notify
          tasksToBeCreated.push(taskToBeAdded)
        }
      } else if (
        task.repeatMode?.repeatDuration === RepeatDurationEnum.BI_WEEKLY
      ) {
        const days = dayjs(recurringEndDate).diff(
          dayjs(task.startAtUtc),
          'days',
        )
        const limit = 14
        for (let i = 0; i <= days; i = i + limit) {
          const start = dayjs(task.startAtUtc).add(i, 'day').toISOString()
          const end = dayjs(task.endAtUtc).add(i, 'day').toISOString()
          const notify = dayjs(task.notifyAtUtc).add(i, 'day').toISOString()
          const taskToBeAdded = JSON.parse(JSON.stringify(task))
          taskToBeAdded.startAtUtc = start
          taskToBeAdded.endAtUtc = end
          taskToBeAdded.notifyAtUtc = notify
          tasksToBeCreated.push(taskToBeAdded)
        }
      } else if (task.repeatMode?.repeatOnWeekDays) {
        const days = dayjs(recurringEndDate).diff(
          dayjs(task.startAtUtc),
          'days',
        )
        for (let i = 0; i <= days; i = i + 1) {
          const day = dayjs(task.startAtUtc).add(i, 'day').get('day')
          if (day > 0 && day < 6) {
            const start = dayjs(task.startAtUtc).add(i, 'day').toISOString()
            const end = dayjs(task.endAtUtc).add(i, 'day').toISOString()
            const notify = dayjs(task.notifyAtUtc).add(i, 'day').toISOString()
            const taskToBeAdded = JSON.parse(JSON.stringify(task))
            taskToBeAdded.startAtUtc = start
            taskToBeAdded.endAtUtc = end
            taskToBeAdded.notifyAtUtc = notify
            tasksToBeCreated.push(taskToBeAdded)
          }
        }
      } else if (task.repeatMode?.repeatOnDays?.length > 0) {
        const days = dayjs(recurringEndDate).diff(
          dayjs(task.startAtUtc),
          'days',
        )
        const weekDays = []
        task.repeatMode.repeatOnDays.forEach((repeatDay) => {
          const dayIndex = this.days.findIndex((day) => day === repeatDay)
          if (dayIndex > -1) {
            weekDays.push(this.days.findIndex((day) => day === repeatDay))
          }
        })
        for (let i = 0; i <= days; i = i + 1) {
          const day = dayjs(task.startAtUtc).add(i, 'day').get('day')
          if (weekDays.findIndex((weekDay) => weekDay === day) > -1) {
            const start = dayjs(task.startAtUtc).add(i, 'day').toISOString()
            const end = dayjs(task.endAtUtc).add(i, 'day').toISOString()
            const notify = dayjs(task.notifyAtUtc).add(i, 'day').toISOString()
            const taskToBeAdded = JSON.parse(JSON.stringify(task))
            taskToBeAdded.startAtUtc = start
            taskToBeAdded.endAtUtc = end
            taskToBeAdded.notifyAtUtc = notify
            tasksToBeCreated.push(taskToBeAdded)
          }
        }
      } else if (
        task.repeatMode?.repeatDuration === RepeatDurationEnum.NONE ||
        _.isEmpty(task.repeatMode)
      ) {
        tasksToBeCreated = tasks
      }
    })
    return tasksToBeCreated
  }

  async createTasksForActvity(
    relationshipActivity: FamilyMemberActivityModel,
    task: TaskModel,
    userId: string,
  ): Promise<TaskModel[]> {
    let activityTimings
    if (
      relationshipActivity.appliesForRelation.indexOf('self') > -1 ||
      relationshipActivity.appliesForRelation.indexOf('partner') > -1
    ) {
      activityTimings =
        await this.activityService.getActivityScheduleByByRelationshipAndName(
          'self',
        )
    } else if (relationshipActivity.appliesForRelation.indexOf('kid') > -1) {
      activityTimings =
        await this.activityService.getActivityScheduleByByRelationshipAndName(
          'kid',
        )
    }

    const selectedActivity = activityTimings.find(
      (actvityTiming) => actvityTiming.name === relationshipActivity.name,
    )

    const calls = []
    const selectedTasksAsPerDay = []
    selectedActivity?.days?.forEach((day) => {
      const nextDay = this.getNextWeekDay(this.days.indexOf(day))
      const startDateAtUtc = dayjs(nextDay).startOf('day').toISOString()
      const endDateAtUtc = dayjs(nextDay).endOf('day').toISOString()
      calls.push(
        this.taskRepository.getTasksByStartAndEndDate(
          userId,
          startDateAtUtc,
          endDateAtUtc,
        ),
      )
      selectedTasksAsPerDay.push({
        day: day,
        selectedTasks: [],
        startDateAtUtc,
        endDateAtUtc,
      })
    })
    const selectedTasks = await Promise.all(calls)
    selectedTasks.forEach((tasks, index) => {
      selectedTasksAsPerDay[index].selectedTasks = tasks
    })
    const selectedDays = []
    let isTaskCreated = false
    const tasksNeedToBeAdded = []
    for (let i = 0; i < selectedActivity?.numberOfTimesPerWeek; i++) {
      isTaskCreated = false
      selectedTasksAsPerDay.forEach((day) => {
        if (selectedDays.indexOf(day.day) < 0 && !isTaskCreated) {
          task.startAtUtc = day.startDateAtUtc
          task.endAtUtc = day.endDateAtUtc
          task['selectedTasks'] = selectedTasks
          const selectedTimeSlabs = []
          selectedActivity.timings.forEach((timeSlab) => {
            const slab = timeSlab.split(' - ')
            const startTime = this.getMinutesFromTimestamp(slab[0])
            const endTime = this.getMinutesFromTimestamp(slab[1])
            selectedTimeSlabs.push({ timeSlab, startTime, endTime })
          })
          const selectedSlabs = this.validateTemplateTasksBySelectedTasks(
            task,
            selectedTimeSlabs,
          )
          if (selectedSlabs?.length > 0) {
            selectedDays.push(day.day)
            const selectedTimeSlab = selectedSlabs[0]
            task['startAtUtc'] = dayjs(task['startDate'])
              .add(selectedTimeSlab.startTime, 'minutes')
              .toISOString()
            task.endAtUtc = dayjs(task['startDate'])
              .add(selectedTimeSlab.endTime, 'minutes')
              .toISOString()
            task.notifyAtUtc = dayjs(task['startDate'])
              .add(selectedTimeSlab.startTime - 10, 'minutes')
              .toISOString()
            delete task['startDate']
            delete task['endDate']
            delete task['selectedTasks']
            isTaskCreated = true
            task.repeatMode = {
              repeatOnDays: [],
            }
            task.repeatMode.repeatOnDays.push(day.day)
            tasksNeedToBeAdded.push(JSON.parse(JSON.stringify(task)))
          }
        }
      })
    }

    const tasks = await this.createTasks(tasksNeedToBeAdded, userId, false)

    return tasks
  }

  getNextWeekDay(dayINeed) {
    const today = dayjs().day()

    if (today <= dayINeed) {
      return dayjs().add(dayINeed - today, 'day')
    } else {
      return dayjs().add(7 - today + dayINeed, 'day')
    }
  }

  validateTemplateInfo(template: TemplateModel, isUpdateTemplate = false) {
    if (
      template.startAtUtc &&
      template.endAtUtc &&
      dayjs(template.startAtUtc).diff(dayjs(template.endAtUtc), 'minutes') >= 0
    ) {
      throw new ArgumentValidationError(
        'The start date of the template should be less than the end date',
        template,
        ApiErrorCode.E0102,
      )
    } else if (
      template.startAtUtc &&
      template.endAtUtc &&
      ((dayjs(template.startAtUtc).diff(dayjs(), 'minutes') < 0 &&
        dayjs(template.endAtUtc).diff(dayjs(), 'minutes') < 0 &&
        isUpdateTemplate) ||
        ((dayjs(template.startAtUtc).diff(dayjs(), 'minutes') < 0 ||
          dayjs(template.endAtUtc).diff(dayjs(), 'minutes') < 0) &&
          !isUpdateTemplate))
    ) {
      throw new ArgumentValidationError(
        "The start and the end date of the template cannot be less than today's date",
        template,
        ApiErrorCode.E0103,
      )
    } else if (
      template.startAtUtc &&
      template.endAtUtc &&
      dayjs(template.startAtUtc).diff(dayjs(), 'minutes') < 0 &&
      !isUpdateTemplate
    ) {
      throw new ArgumentValidationError(
        "The start date of the template cannot be less than today's date",
        template,
        ApiErrorCode.E0107,
      )
    } else if (
      template.startAtUtc &&
      template.endAtUtc &&
      dayjs(template.endAtUtc).diff(dayjs(), 'minutes') < 0 &&
      !isUpdateTemplate
    ) {
      throw new ArgumentValidationError(
        "The end date of the template cannot be less than today's date",
        template,
        ApiErrorCode.E0108,
      )
    }
  }

  validateTaskInfo(tasks: TaskModel[], isUpdateTasks = false) {
    tasks.forEach((task) => {
      if (
        task.startAtUtc &&
        task.endAtUtc &&
        dayjs(task.startAtUtc).diff(dayjs(task.endAtUtc), 'minutes') >= 0
      ) {
        throw new ArgumentValidationError(
          'The start date of the task should be less than the end date',
          task,
          ApiErrorCode.E0015,
        )
      } else if (
        task.startAtUtc &&
        task.endAtUtc &&
        dayjs(task.startAtUtc).diff(dayjs(), 'minutes') < 0 &&
        dayjs(task.endAtUtc).diff(dayjs(), 'minutes') < 0 &&
        isUpdateTasks
      ) {
        throw new ArgumentValidationError(
          "The start and the end date cannot be less than today's date",
          task,
          ApiErrorCode.E0016,
        )
      } else if (
        task.startAtUtc &&
        task.endAtUtc &&
        dayjs(task.startAtUtc).diff(dayjs(), 'minutes') < 0 &&
        !isUpdateTasks
      ) {
        throw new ArgumentValidationError(
          "The start date cannot be less than today's date",
          task,
          ApiErrorCode.E0105,
        )
      } else if (
        task.startAtUtc &&
        task.endAtUtc &&
        dayjs(task.endAtUtc).diff(dayjs(), 'minutes') < 0 &&
        !isUpdateTasks
      ) {
        throw new ArgumentValidationError(
          "The end date cannot be less than today's date",
          task,
          ApiErrorCode.E0106,
        )
      } else if (
        task.notifyAtUtc &&
        task.startAtUtc &&
        dayjs(task.notifyAtUtc).diff(dayjs(task.startAtUtc), 'minutes') > 0
      ) {
        throw new ArgumentValidationError(
          'The notify date can not be greater than start date',
          task,
          ApiErrorCode.E0017,
        )
      }
    })
  }

  async validateTemplateTasks(
    tasks: TaskModel[],
    userId: string,
  ): Promise<TaskModel[]> {
    const familyMemberId = tasks[0]?.familyMemberId
    const userDetails = await this.familyMemberService.getFamilyMemberById(
      familyMemberId,
    )

    const workHours = userDetails[0]?.otherInfo[0]?.workHours
    const workHoursStartTime = this.getMinutesFromTimestamp(
      workHours?.startTime,
    )
    let workHoursEndTime = this.getMinutesFromTimestamp(workHours?.endTime)
    workHoursEndTime =
      workHoursEndTime < workHoursStartTime
        ? 24 * 60 + workHoursEndTime
        : workHoursEndTime
    const calls = []
    tasks.forEach((task) => {
      task['startDate'] = dayjs(task.startAtUtc).startOf('day').toISOString()
      task['endDate'] = dayjs(task.endAtUtc).startOf('day').toISOString()
    })
    const tasksGroupByStartDate = _.groupBy(tasks, 'startDate')

    _.each(tasksGroupByStartDate, (task) => {
      const startDate = dayjs(task[0].startAtUtc).startOf('day').toISOString()
      const endDate = dayjs(task[0].startAtUtc).endOf('day').toISOString()

      calls.push(
        this.taskRepository.getTasksByStartAndEndDate(
          userId,
          startDate,
          endDate,
        ),
      )
    })

    const tasksForEachTemplateTasks = await Promise.all(calls)
    const dates = Object.keys(tasksGroupByStartDate)
    tasksForEachTemplateTasks.forEach((selectedTasks) => {
      if (selectedTasks.length > 0) {
        const startDate = dayjs(selectedTasks[0].startAtUtc)
          .startOf('day')
          .toISOString()
        if (dates.indexOf(startDate) > -1) {
          tasksGroupByStartDate[startDate].forEach((task) => {
            task.selectedTasks = selectedTasks
          })
        }
      }
    })

    let taskNeededToBeAdded = []
    dates.forEach((date) => {
      const selectedTasks = this.validateTemplateTasksByWorkHours(
        workHoursStartTime,
        workHoursEndTime,
        tasksGroupByStartDate[date],
      )
      taskNeededToBeAdded = selectedTasks.concat(taskNeededToBeAdded)
    })

    return taskNeededToBeAdded
  }

  validateTemplateTasksByWorkHours(
    workHoursStartTime: number,
    workHoursEndTime: number,
    tasks: TaskModel[],
  ): TaskModel[] {
    const selectedTimeSlabs = []
    defaultTimeSlabs.forEach((timeSlab) => {
      const slab = timeSlab.split(' - ')
      const startTime = this.getMinutesFromTimestamp(slab[0])
      const endTime = this.getMinutesFromTimestamp(slab[1])
      if (workHoursStartTime && workHoursEndTime) {
        if (
          !(
            (workHoursStartTime < startTime && workHoursEndTime > startTime) ||
            (workHoursStartTime < endTime && workHoursEndTime > endTime)
          )
        ) {
          selectedTimeSlabs.push({ timeSlab, startTime, endTime })
        }
      } else {
        selectedTimeSlabs.push({ timeSlab, startTime, endTime })
      }
    })

    if (tasks?.length > 0) {
      const selectedSlabs = this.validateTemplateTasksBySelectedTasks(
        tasks[0],
        selectedTimeSlabs,
      )

      tasks.forEach((task, index) => {
        const selectedTimeSlab = selectedSlabs[index]
          ? selectedSlabs[index]
          : selectedSlabs[0]
        task['startAtUtc'] = dayjs(task['startDate'])
          .add(selectedTimeSlab.startTime, 'minutes')
          .toISOString()
        task.endAtUtc = dayjs(task['startDate'])
          .add(selectedTimeSlab.endTime, 'minutes')
          .toISOString()
        task.notifyAtUtc = dayjs(task['startDate'])
          .add(selectedTimeSlab.startTime - 10, 'minutes')
          .toISOString()
        delete task['startDate']
        delete task['endDate']
        delete task['selectedTasks']
      })
    }

    return tasks ? tasks : []
  }

  validateTemplateTasksBySelectedTasks(
    selectedTask,
    selectedTimeSlabs,
  ): [Record<string, number>] {
    let selectedSlabs = selectedTimeSlabs
    const startTimeOfCurrentDate = this.getMinutesFromTimestamp(
      dayjs().format('hh:mm A'),
    )
    const endTimeOfCurrentDate = this.getMinutesFromTimestamp(
      dayjs().format('hh:mm A'),
    )

    if (
      dayjs(selectedTask.startAtUtc).format('YYYY-MM-DD') ===
        dayjs().format('YYYY-MM-DD') ||
      dayjs(selectedTask.endAtUtc).format('YYYY-MM-DD') ===
        dayjs().format('YYYY-MM-DD')
    ) {
      selectedSlabs.forEach((timeSlab) => {
        if (
          timeSlab.startTime < startTimeOfCurrentDate ||
          timeSlab.endTime < startTimeOfCurrentDate ||
          timeSlab.startTime < endTimeOfCurrentDate ||
          timeSlab.endTime < endTimeOfCurrentDate ||
          (startTimeOfCurrentDate === timeSlab.startTime &&
            endTimeOfCurrentDate === timeSlab.endTime)
        ) {
          selectedSlabs = selectedSlabs.filter(
            (slab) =>
              !(
                slab.startTime === timeSlab.startTime &&
                slab.endTime === timeSlab.endTime
              ),
          )
        }
      })
    }
    selectedTask.selectedTasks?.forEach((task) => {
      selectedSlabs.forEach((timeSlab) => {
        const startTime = this.getMinutesFromTimestamp(
          dayjs(task.startAtUtc).format('hh:mm A'),
        )
        const endTime = this.getMinutesFromTimestamp(
          dayjs(task.endAtUtc).format('hh:mm A'),
        )
        if (
          (startTime < timeSlab.startTime && endTime > timeSlab.startTime) ||
          (startTime < timeSlab.endTime && endTime > timeSlab.endTime) ||
          (startTime === timeSlab.startTime && endTime === timeSlab.endTime)
        ) {
          selectedSlabs = selectedSlabs.filter(
            (slab) =>
              !(
                slab.startTime === timeSlab.startTime &&
                slab.endTime === timeSlab.endTime
              ),
          )
        }
      })
    })

    return selectedSlabs
  }

  getMinutesFromTimestamp(timestamp): number {
    const isAm = timestamp?.indexOf('AM') > -1
    const time = timestamp?.replace(' PM', '')?.replace(' AM', '')?.split(':')
    const hours = Number(time[0])
    const minutes = Number(time[1])

    if (isAm) {
      return Number(Number(hours === 12 ? 0 : hours * 60) + minutes)
    } else {
      return Number(
        Number(hours === 12 ? hours * 60 : (hours + 12) * 60) + minutes,
      )
    }
  }
}
