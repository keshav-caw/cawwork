import * as express from 'express'
import {
  interfaces,
  controller,
  request,
  response,
  httpPost,
  httpGet,
  next,
  queryParam,
  httpDelete,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { CommonTypes } from '../../common/common.types'
import { TaskTypes } from './task.types'
import { TaskService } from './task.service'
import { RequestContext } from '../../common/jwtservice/requests-context.service'

@controller('/tasks')
export class TasksController implements interfaces.Controller {
  constructor(
    @inject(TaskTypes.task)
    private taskService: TaskService,
    @inject(CommonTypes.requestContext)
    private requestContext: RequestContext,
  ) {}

  @httpGet('/', CommonTypes.jwtAuthMiddleware)
  public async getTasksByUserId(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    const userId = this.requestContext.getUserId()
    const details = await this.taskService.getTasksByUserId(userId)
    return res.send(details)
  }

  @httpGet('/:taskId', CommonTypes.jwtAuthMiddleware)
  public async getTaskDetailsByTaskId(
    @queryParam('taskId') taskId: string,
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    const details = await this.taskService.getTaskDetailsByTaskId(taskId)
    return res.send(details)
  }

  @httpPost('/', CommonTypes.jwtAuthMiddleware)
  private async createTasks(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    res.send(await this.taskService.createTasks(req.body))
  }

  @httpDelete('/:taskId', CommonTypes.jwtAuthMiddleware)
  private async deleteFamilyMember(
    @queryParam('taskId') taskId: string,
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    res.send(await this.taskService.deleteTask(taskId))
  }
}
