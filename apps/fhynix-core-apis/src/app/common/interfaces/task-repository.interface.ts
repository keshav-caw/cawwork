import { TaskModel } from '../models/task.model'

export interface TaskRepositoryInterface {
  getTasksByStartAndEndDate(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<TaskModel[]>
  getTaskDetailsByTaskId(taskId: string, userId: string): Promise<TaskModel[]>
  createTask(tasks: TaskModel): Promise<TaskModel[]>
  deleteTask(taskId: string): Promise<TaskModel>
}
