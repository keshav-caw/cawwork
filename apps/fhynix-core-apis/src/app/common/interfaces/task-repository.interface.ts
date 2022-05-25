import { TaskModel } from '../models/task.model'

export interface TaskRepositoryInterface {
  createTasks(tasks: TaskModel): Promise<TaskModel[]>
}
