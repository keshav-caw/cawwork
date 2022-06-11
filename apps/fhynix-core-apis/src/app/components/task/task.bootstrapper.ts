import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { TaskServiceInterface } from '../../common/interfaces/task-service.interface'
import { TaskController } from './task.controller'
import { TaskRepository } from './task.repository'
import { TaskService } from './task.service'
import { TaskTypes } from './task.types'
import { TemplateController } from './template.controller'

@injectable()
export default class TaskBootstrapper {
  public static initialize() {
    CommonContainer.bind<TaskRepository>('TaskRepository').to(TaskRepository)
    CommonContainer.bind<TaskServiceInterface>(TaskTypes.task).to(TaskService)
    CommonContainer.bind<TaskController>('TaskController').to(TaskController)
    CommonContainer.bind<TemplateController>('TemplateController').to(
      TemplateController,
    )
  }
}
