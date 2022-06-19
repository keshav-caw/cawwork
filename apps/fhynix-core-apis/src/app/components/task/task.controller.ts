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
  httpPut,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { CommonTypes } from '../../common/common.types'
import { TaskTypes } from './task.types'
import { TaskService } from './task.service'
import { RequestContext } from '../../common/jwtservice/requests-context.service'

@controller('/tasks')
export class TaskController implements interfaces.Controller {
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
    const startDate = req.query.start_date.toString()
    const endDate = req.query.end_date.toString()
    const details = await this.taskService.getTasksByStartAndEndDate(
      userId,
      startDate,
      endDate,
    )
    return res.send(details)
  }

  @httpGet('/:taskId', CommonTypes.jwtAuthMiddleware)
  public async getTaskDetailsByTaskId(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    const userId = this.requestContext.getUserId()
    const details = await this.taskService.getTaskDetailsByTaskId(
      req.params.taskId,
      userId,
    )
    return res.send(details)
  }

  @httpPost('/', CommonTypes.jwtAuthMiddleware)
  private async createTasks(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    res.send(await this.taskService.createTasks(req.body))
  }

  @httpPut('/:taskId', CommonTypes.jwtAuthMiddleware)
  private async updateTasks(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const userId = this.requestContext.getUserId()
    res.send(
      await this.taskService.updateTasks(
        req.params.taskId,
        req.body.taskDetails,
        req.body.isAllEvents,
        req.body.isDateUpdated,
        userId,
      ),
    )
  }

  @httpDelete('/:taskId', CommonTypes.jwtAuthMiddleware)
  private async deleteTask(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    res.send(await this.taskService.deleteTask(req.params.taskId))
  }

  @httpDelete('/all/:recurringTaskId', CommonTypes.jwtAuthMiddleware)
  private async deleteRecurringTasks(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    res.send(
      await this.taskService.deleteTaskByRecurringTaskId(
        req.params.recurringTaskId,
      ),
    )
  }
}
