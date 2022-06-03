import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TaskServiceInterface } from '../../common/interfaces/task-service.interface'
import { TaskRepository } from './task.repository'
import dayjs from 'dayjs'
import { ArgumentValidationError } from '../../common/errors/custom-errors/argument-validation.error'
import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { TaskModel } from '../../common/models/task.model'

@injectable()
export class TaskService implements TaskServiceInterface {
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

  async createTasks(tasks: TaskModel[]): Promise<TaskModel[]> {
    this.validateTaskInfo(tasks)
    const calls = []
    tasks.forEach((task) => {
      calls.push(this.taskRepository.createTask(task))
    })
    return await Promise.all(calls)
  }

  async deleteTask(taskId: string) {
    return await this.taskRepository.deleteTask(taskId)
  }

  validateTaskInfo(tasks: TaskModel[]) {
    tasks.forEach((task) => {
      if (dayjs(task.startAtUtc).diff(dayjs(task.endAtUtc), 'minutes') >= 0) {
        throw new ArgumentValidationError(
          'The start date of the task should be less than the end date',
          task,
          ApiErrorCode.E0015,
        )
      } else if (
        dayjs(task.startAtUtc).diff(dayjs(), 'minutes') < 0 ||
        dayjs(task.endAtUtc).diff(dayjs(), 'minutes') < 0
      ) {
        throw new ArgumentValidationError(
          "The start and the end date cannot be less than today's date",
          task,
          ApiErrorCode.E0016,
        )
      } else if (
        task.notifyAtUtc &&
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
