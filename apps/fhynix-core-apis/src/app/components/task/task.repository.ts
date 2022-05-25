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

  async getTasksByUserId(userId: string): Promise<TaskModel[]> {
    const result = await this.client.tasks?.findMany({
      where: {
        userId: userId,
        isDeleted: false,
      },
    })
    return result ? result : []
  }

  async getTaskDetailsByTaskId(taskId: string): Promise<TaskModel[]> {
    const result = await this.client.tasks?.findMany({
      where: {
        id: taskId,
        isDeleted: false,
      },
    })
    return result ? result : []
  }

  async createTasks(task: TaskModel): Promise<TaskModel[]> {
    const result = await this.client.tasks?.create({
      data: task,
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
}
