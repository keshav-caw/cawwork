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

@injectable()
export class TaskService implements TaskServiceInterface {
  days: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  constructor(
    @inject('TaskRepository')
    private taskRepository: TaskRepository,
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

  async getMasterTemplates(): Promise<TemplateModel[]> {
    return await this.taskRepository.getMasterTemplates()
  }

  async getTemplates(): Promise<TemplateModel[]> {
    return await this.taskRepository.getTemplates()
  }

  async createTasksByTemplateId(
    template: TemplateModel,
    templateId: string,
  ): Promise<TaskModel[]> {
    const scheduledTasks = template.scheduleList
    delete template.scheduleList
    template.parentTemplateId = templateId
    const templateDetails = await this.taskRepository.createTemplate(template)

    scheduledTasks.forEach(
      (task) => (task.eventTemplateId = templateDetails.id),
    )
    return await this.createTasks(scheduledTasks)
  }

  async createTasks(tasks: TaskModel[]): Promise<TaskModel[]> {
    this.validateTaskInfo(tasks)
    const createTasksInfo = this.createTasksInfo(tasks)
    const recurringTaskId = uuidv4()
    const calls = []
    createTasksInfo.forEach((task) => {
      task.recurringTaskId = recurringTaskId
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
        !task.repeatMode?.repeatDuration
      ) {
        tasksToBeCreated = tasks
      }
    })
    return tasksToBeCreated
  }

  validateTaskInfo(tasks: TaskModel[]) {
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
}
