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

  async createTasks(task: TaskModel): Promise<TaskModel[]> {
    const result = await this.client.tasks?.create({
      data: task,
    })
    return result
  }
}
