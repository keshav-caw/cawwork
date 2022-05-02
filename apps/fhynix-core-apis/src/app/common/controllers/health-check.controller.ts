import * as express from 'express'
import {
  interfaces,
  controller,
  httpGet,
  request,
  response,
  next,
} from 'inversify-express-utils'

@controller('')
export class HealthCheckController implements interfaces.Controller {
  @httpGet('/health')
  public async getHealthStatus(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    return res.send('App is healthy!!')
  }

  @httpGet('/heartbeat')
  public async getHeartBeat(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    return res.send('App is healthy!!')
  }
}
