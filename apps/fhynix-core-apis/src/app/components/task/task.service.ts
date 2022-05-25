import { RelationshipsMaster } from '@prisma/client'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TaskServiceInterface } from '../../common/interfaces/task-service.interface'
import { TaskModel } from '../../common/models/task.model'
import { TaskRepository } from './task.repository'

@injectable()
export class TaskService implements TaskServiceInterface {
  constructor(
    @inject('TaskRepository')
    private taskRepository: TaskRepository,
  ) {}

  async createTasks(tasks: TaskModel[]): Promise<TaskModel[]> {
    const calls = []
    tasks.forEach((task) => {
      calls.push(this.taskRepository.createTasks(task))
    })
    return await Promise.all(calls)
  }
}
