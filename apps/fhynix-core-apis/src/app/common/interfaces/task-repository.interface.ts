import { TaskModel } from '../models/task.model'

export interface TaskRepositoryInterface {
  createTask(tasks: TaskModel): Promise<TaskModel[]>
  deleteTask(taskId: string): Promise<TaskModel>
}
