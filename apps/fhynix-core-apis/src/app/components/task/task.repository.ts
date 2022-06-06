import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../common/data/datastore'
import { TaskRepositoryInterface } from '../../common/interfaces/task-repository.interface'
import { TaskModel } from '../../common/models/task.model'

@injectable()
export class TaskRepository implements TaskRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getTasksByStartAndEndDate(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<TaskModel[]> {
    const result = await this.client.tasks?.findMany({
      where: {
        userId: userId,
        isDeleted: false,
        AND: [
          {
            AND: [
              {
                startAtUtc: {
                  gt: startDate,
                },
              },
              {
                startAtUtc: {
                  lt: endDate,
                },
              },
            ],
          },
          {
            AND: [
              {
                endAtUtc: {
                  gt: startDate,
                },
              },
              {
                endAtUtc: {
                  lt: endDate,
                },
              },
            ],
          },
        ],
      },
    })
    return result ? result : []
  }

  async getTaskDetailsByTaskId(
    taskId: string,
    userId: string,
  ): Promise<TaskModel[]> {
    const result = await this.client.tasks?.findMany({
      where: {
        id: taskId,
        userId: userId,
        isDeleted: false,
      },
    })
    return result ? result : []
  }

  async createTask(task: TaskModel): Promise<TaskModel[]> {
    const result = await this.client.tasks?.create({
      data: task,
    })
    return result
  }

  async updateTaskById(
    taskDetails: TaskModel,
    taskId: string,
  ): Promise<TaskModel[]> {
    const result = await this.client.tasks?.update({
      data: taskDetails,
      where: {
        id: taskId,
      },
    })
    return result
  }

  async updateTaskByRecurringTaskId(
    taskDetails: TaskModel,
    recurringTaskId: string,
  ): Promise<TaskModel[]> {
    const result = await this.client.tasks?.update({
      data: taskDetails,
      where: {
        recurringTaskId: recurringTaskId,
      },
    })
    return result
  }

  async deleteTask(taskId: string): Promise<TaskModel> {
    const result = await this.client.tasks?.update({
      data: { isDeleted: true },
      where: {
        id: taskId,
      },
    })
    return result
  }

  async deleteTaskByRecurringTaskId(
    recurringTaskId: string,
    currentDate: string,
  ): Promise<TaskModel> {
    const result = await this.client.tasks?.update({
      data: { isDeleted: true },
      where: {
        recurringTaskId: recurringTaskId,
        startAtUtc: {
          gt: currentDate,
        },
      },
    })
    return result
  }
}
