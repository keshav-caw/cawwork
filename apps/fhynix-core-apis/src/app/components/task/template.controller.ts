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

@controller('/templates')
export class TemplateController implements interfaces.Controller {
  constructor(
    @inject(TaskTypes.task)
    private taskService: TaskService,
    @inject(CommonTypes.requestContext)
    private requestContext: RequestContext,
  ) {}

  @httpGet('/master', CommonTypes.jwtAuthMiddleware)
  public async getMasterTemplates(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    const details = await this.taskService.getMasterTemplates()
    return res.send(details)
  }

  @httpGet('/', CommonTypes.jwtAuthMiddleware)
  public async getTemplates(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    const details = await this.taskService.getTemplates()
    return res.send(details)
  }

  @httpPost('/:id/tasks', CommonTypes.jwtAuthMiddleware)
  private async createTaskByTemplate(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    res.send(
      await this.taskService.createTasksByTemplateId(req.body, req.params.id),
    )
  }

  @httpPut('/:id/tasks/:taskId', CommonTypes.jwtAuthMiddleware)
  private async updateTaskByTemplateId(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const userId = this.requestContext.getUserId()
    res.send(
      await this.taskService.updateTasks(
        req.params.taskId,
        req.body.taskDetails,
        req.body.isAllEvents,
        userId,
      ),
    )
  }

  @httpDelete('/:id', CommonTypes.jwtAuthMiddleware)
  private async deleteTemaplateById(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    res.send(await this.taskService.deleteTemplate(req.params.id))
  }

  @httpDelete('/:id/tasks/:taskId', CommonTypes.jwtAuthMiddleware)
  private async deleteTask(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    res.send(await this.taskService.deleteTask(req.params.taskId))
  }
}
