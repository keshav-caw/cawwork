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

@injectable()
export class TaskService implements TaskServiceInterface {
  days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  constructor(
    @inject('TaskRepository')
    private taskRepository: TaskRepository,
    @inject(FamilyMemberTypes.familyMember)
    private familyMemberService: FamilyMemberService,
  ) {}

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

  async getTemplates(): Promise<TemplateModel[]> {
    return await this.taskRepository.getTemplates()
  }

  async createUserTemplate(
    template: TemplateModel,
    templateId: string,
  ): Promise<TemplateModel[]> {
    template.parentTemplateId = templateId
    const templateDetails = await this.taskRepository.createTemplate(template)

    return templateDetails
  }

  async updateUserTemplate(
    template: TemplateModel,
    templateId: string,
  ): Promise<TemplateModel[]> {
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
    return await this.createTasks(tasksNeededToBeAdded)
  }

  async createTasks(tasks: TaskModel[]): Promise<TaskModel[]> {
    this.validateTaskInfo(tasks)
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
    return await Promise.all(calls)
  }

  async updateTasks(
    taskId: string,
    taskDetails: TaskModel,
    isAllEvents: boolean,
    userId: string,
  ): Promise<TaskModel[]> {
    this.validateTaskInfo([taskDetails])
    if (isAllEvents) {
      const taskInfo = await this.taskRepository.getTaskDetailsByTaskId(
        taskId,
        userId,
      )
      if (taskDetails.startAtUtc || taskDetails.endAtUtc) {
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
          return await this.createTasks(taskInfo)
        } else {
          return await this.createTasks([taskDetails])
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
      if (taskDetails.startAtUtc || taskDetails.endAtUtc) {
        await this.taskRepository.deleteTask(taskId)
        if (taskInfo?.length > 0) {
          const keys = Object.keys(taskDetails)
          keys.forEach((key) => {
            taskInfo[0][key] = taskDetails[key]
          })
          delete taskInfo[0]['id']
          delete taskInfo[0]['createdAtUtc']
          delete taskInfo[0]['updatedAtUtc']
          return await this.createTasks(taskInfo)
        }
      } else {
        return await this.taskRepository.updateTaskById(taskDetails, taskId)
      }
    }
  }

  async deleteTask(taskId: string): Promise<TaskModel> {
    return await this.taskRepository.deleteTask(taskId)
  }

  async deleteTemplate(templateId: string): Promise<TaskModel[]> {
    await this.taskRepository.deleteTemplate(templateId)
    return await this.taskRepository.deleteTasksByTemplateId(templateId)
  }

  createTasksInfo(tasks) {
    let tasksToBeCreated = []
    tasks.forEach((task: TaskModel) => {
      if (task.repeatMode?.repeatDuration === RepeatDurationEnum.DAILY) {
        const days = dayjs(task.endAtUtc).diff(dayjs(task.startAtUtc), 'days')
        for (let i = 0; i <= days; i++) {
          const start = dayjs(task.startAtUtc).add(i, 'day').toISOString()
          const end = dayjs(task.endAtUtc)
            .subtract(days - i, 'day')
            .toISOString()
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
        const days = dayjs(task.endAtUtc).diff(dayjs(task.startAtUtc), 'months')
        for (let i = 0; i <= days; i++) {
          const start = dayjs(task.startAtUtc).add(i, 'month').toISOString()
          const end = dayjs(task.endAtUtc)
            .subtract(days - i, 'month')
            .toISOString()
          const notify = dayjs(task.notifyAtUtc).add(i, 'month').toISOString()
          const taskToBeAdded = JSON.parse(JSON.stringify(task))
          taskToBeAdded.startAtUtc = start
          taskToBeAdded.endAtUtc = end
          taskToBeAdded.notifyAtUtc = notify
          tasksToBeCreated.push(taskToBeAdded)
        }
      } else if (
        task.repeatMode?.repeatDuration === RepeatDurationEnum.WEEKLY ||
        task.repeatMode?.repeatDuration === RepeatDurationEnum.BI_WEEKLY
      ) {
        const days = dayjs(task.endAtUtc).diff(dayjs(task.startAtUtc), 'days')
        const limit =
          task.repeatMode.repeatDuration === RepeatDurationEnum.WEEKLY ? 7 : 14
        for (let i = 0; i <= days; i = i + limit) {
          const start = dayjs(task.startAtUtc).add(i, 'day').toISOString()
          const end = dayjs(task.endAtUtc)
            .subtract(days - i, 'day')
            .toISOString()
          const notify = dayjs(task.notifyAtUtc).add(i, 'day').toISOString()
          const taskToBeAdded = JSON.parse(JSON.stringify(task))
          taskToBeAdded.startAtUtc = start
          taskToBeAdded.endAtUtc = end
          taskToBeAdded.notifyAtUtc = notify
          tasksToBeCreated.push(taskToBeAdded)
        }
      } else if (task.repeatMode?.repeatOnWeekDays) {
        const days = dayjs(task.endAtUtc).diff(dayjs(task.startAtUtc), 'days')
        for (let i = 0; i <= days; i = i + 1) {
          const day = dayjs(task.startAtUtc).add(i, 'day').get('day')
          if (day > 0 && day < 6) {
            const start = dayjs(task.startAtUtc).add(i, 'day').toISOString()
            const end = dayjs(task.endAtUtc)
              .subtract(days - i, 'day')
              .toISOString()
            const notify = dayjs(task.notifyAtUtc).add(i, 'day').toISOString()
            const taskToBeAdded = JSON.parse(JSON.stringify(task))
            taskToBeAdded.startAtUtc = start
            taskToBeAdded.endAtUtc = end
            taskToBeAdded.notifyAtUtc = notify
            tasksToBeCreated.push(taskToBeAdded)
          }
        }
      } else if (task.repeatMode?.repeatOnDays?.length > 0) {
        const days = dayjs(task.endAtUtc).diff(dayjs(task.startAtUtc), 'days')
        const weekDays = []
        task.repeatMode.repeatOnDays.forEach((repeatDay) => {
          const dayIndex = this.days.findIndex((day) => day === repeatDay)
          if (dayIndex > -1) {
            weekDays.push(this.days.findIndex((day) => day === repeatDay))
          }
        })
        for (let i = 0; i <= days; i = i + 1) {
          const day = dayjs(task.startAtUtc).add(i, 'day').get('day')
          if (weekDays.findIndex((weekDay) => weekDay === day) > 0) {
            const start = dayjs(task.startAtUtc).add(i, 'day').toISOString()
            const end = dayjs(task.endAtUtc)
              .subtract(days - i, 'day')
              .toISOString()
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

  validateTaskInfo(tasks: TaskModel[]) {
    tasks.forEach((task) => {
      if (!task.recurringEndAtUtc) {
        task.endAtUtc = dayjs(task.endAtUtc)
          .add(1, 'year')
          .subtract(1, 'day')
          .toISOString()
      }
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
        (dayjs(task.startAtUtc).diff(dayjs(), 'minutes') < 0 ||
          dayjs(task.endAtUtc).diff(dayjs(), 'minutes') < 0)
      ) {
        throw new ArgumentValidationError(
          "The start and the end date cannot be less than today's date",
          task,
          ApiErrorCode.E0016,
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
    this.validateTaskInfo(tasks)
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
