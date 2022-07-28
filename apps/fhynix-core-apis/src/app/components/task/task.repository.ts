import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../common/data/datastore'
import { TaskSourceEnum } from '../../common/enums/task-source.enum'
import { TaskRepositoryInterface } from '../../common/interfaces/task-repository.interface'
import { PaginationModel } from '../../common/models/pagination.model'
import { TaskModel } from '../../common/models/task.model'
import { TemplateModel } from '../../common/models/template-model'

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

  async getTaskDetailsByTemplateId(
    eventTemplateId: string,
    userId: string,
  ): Promise<TaskModel[]> {
    const result = await this.client.tasks?.findMany({
      where: {
        eventTemplateId: eventTemplateId,
        userId: userId,
        isDeleted: false,
      },
    })
    return result ? result : []
  }

  async getMasterTemplates(): Promise<TemplateModel[]> {
    const result = await this.client.eventTemplates?.findMany({
      where: {
        isDeleted: false,
        isMaster: true,
      },
    })
    return result ? result : []
  }

  async getTemplates(userId: string): Promise<TemplateModel[]> {
    const result = await this.client.eventTemplates?.findMany({
      where: {
        isDeleted: false,
        isMaster: false,
        userId: userId,
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

  async createTemplate(template: TemplateModel): Promise<TemplateModel[]> {
    const result = await this.client.eventTemplates?.create({
      data: template,
    })
    return result
  }

  async updateUserTemplate(
    template: TemplateModel,
    templateId: string,
  ): Promise<TemplateModel[]> {
    const result = await this.client.eventTemplates?.update({
      data: template,
      where: {
        id: templateId,
      },
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

  async deleteTaskByActivityId(
    activityId: string,
    userId: string,
  ): Promise<TaskModel> {
    const result = await this.client.tasks?.update({
      data: { isDeleted: true },
      where: {
        userId: userId,
        activityId: activityId,
      },
    })
    return result
  }

  async deleteTasksByFamilyMemberId(
    familymemberid: string,
    userId: string,
  ): Promise<TaskModel[]> {
    const result = await this.client.tasks?.updateMany({
      data: { isDeleted: true },
      where: {
        userId: userId,
        activityId: familymemberid,
      },
    })
    return result
  }

  async deleteTaskByRecurringTaskId(
    recurringTaskId: string,
    currentDate: string,
  ): Promise<TaskModel> {
    const result = await this.client.tasks?.updateMany({
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

  async deleteTemplate(templateId: string): Promise<TemplateModel> {
    const result = await this.client.eventTemplates?.update({
      data: { isDeleted: true },
      where: {
        id: templateId,
      },
    })
    return result
  }

  async deleteTemplateByFamilyMemberId(
    familyMemberId: string,
    userId: string,
  ): Promise<TemplateModel[]> {
    const result = await this.client.eventTemplates?.updateMany({
      data: { isDeleted: true },
      where: {
        familyMemberId: familyMemberId,
        userId: userId,
      },
    })
    return result
  }

  async deleteTasksByTemplateId(
    templateId: string,
    userId: string,
  ): Promise<TaskModel[]> {
    const result = await this.client.tasks?.updateMany({
      data: { isDeleted: true },
      where: {
        userId: userId,
        eventTemplateId: templateId,
      },
    })
    return result
  }

  async getTasksForSuggestions(
    userId: string,
    startDate: string,
    endDate: string,
    details:PaginationModel
  ): Promise<TaskModel[]> {
    const result = await this.client.tasks?.findMany({
      take:details.pageSize,
      where: {
        userId: userId,
        isDeleted: false,
        taskSource: TaskSourceEnum.Recommendation,
        isFirstTaskOfRecurringMeeting:true,
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
      orderBy:{
        startAtUtc:'asc'
      }
    })
    return result ? result : []
  }
}
