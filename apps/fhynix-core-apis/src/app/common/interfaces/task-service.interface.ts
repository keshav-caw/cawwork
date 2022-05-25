import { TaskModel } from '../models/task.model'

export interface TaskServiceInterface {
  createTasks(tasks: TaskModel[]): Promise<TaskModel[]>
}
