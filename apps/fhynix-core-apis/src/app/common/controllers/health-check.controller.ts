import * as express from 'express'
import {
  interfaces,
  controller,
  httpGet,
  request,
  response,
  next,
} from 'inversify-express-utils'

@controller('/heartbeat')
export class HeartbeatController implements interfaces.Controller {
  @httpGet('/')
  public async check(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    return res.send('OK')
  }
}
