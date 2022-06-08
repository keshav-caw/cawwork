import * as express from 'express'
import {
  interfaces,
  controller,
  httpPost,
  request,
  response,
  httpGet,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { AuthService } from './auth.service'
import { AccountTypes } from './account.types'
import { CommonTypes } from '../../common/common.types'
import { CommonContainer } from '../../common/container'
import { RequestContext } from '../../common/jwtservice/requests-context.service'

@controller('/auth')
export class AuthController implements interfaces.Controller {
  private readonly requestContext = CommonContainer.get<RequestContext>(
    CommonTypes.requestContext,
  )
  constructor(
    @inject(AccountTypes.auth) private authService: AuthService,
  ) {}

  @httpPost('/login')
  private async login(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const details = await this.authService.login(req.body)
    res.send(details)
  }

  @httpPost('/signup')
  private async signup(
    @request() req: express.Request,
    @response() res: express.Response,
  ){
    const details = await this.authService.signup(req.body);
    res.send(details);   
  }

  @httpPost('/delete',CommonTypes.jwtAuthMiddleware)
  private async deleteAccount(
    @request() req: express.Request,
    @response() res: express.Response,
  ){
    const accountId = this.requestContext.getAccountId();
    const details = await this.authService.deleteAccount(accountId);
    res.send(details);   
  }
}
