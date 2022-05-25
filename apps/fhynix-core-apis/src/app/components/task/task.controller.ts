import * as express from 'express'
import {
  interfaces,
  controller,
  request,
  response,
  httpPost,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { CommonTypes } from '../../common/common.types'
import { TaskTypes } from './task.types'
import { TaskService } from './task.service'

@controller('/tasks')
export class TasksController implements interfaces.Controller {
  constructor(
    @inject(TaskTypes.task)
    private taskService: TaskService,
  ) {}

  @httpPost('/', CommonTypes.jwtAuthMiddleware)
  private async createTasks(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    res.send(this.taskService.createTasks(req.body))
  }
}
