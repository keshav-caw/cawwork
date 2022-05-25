import { RelationshipsMaster } from '@prisma/client'
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

  async getTasksByUserId(userId: string): Promise<TaskModel[]> {
    return await this.taskRepository.getTasksByUserId(userId)
  }

  async getTaskDetailsByTaskId(userId: string): Promise<TaskModel[]> {
    return await this.taskRepository.getTaskDetailsByTaskId(userId)
  }

  async createTasks(tasks: TaskModel[]): Promise<TaskModel[]> {
    const calls = []
    tasks.forEach((task) => {
      calls.push(this.taskRepository.createTasks(task))
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
          'StartDate must be less than EndDate',
          task,
          ApiErrorCode.E0015,
        )
      }
    })
  }
}
