import { TaskModel } from '../models/task.model'

export interface TaskServiceInterface {
  getTasksByStartAndEndDate(
    userId: string,
    startDate: string,
    endDate: string,
  ): Promise<TaskModel[]>
  getTaskDetailsByTaskId(taskId: string, userId: string): Promise<TaskModel[]>
  createTasks(tasks: TaskModel[]): Promise<TaskModel[]>
}
