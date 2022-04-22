import * as express from 'express'
import {
  interfaces,
  controller,
  httpPost,
  request,
  response,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { AuthService } from './auth.service'
import { AccountTypes } from './account.types'

@controller('/auth')
export class AuthController implements interfaces.Controller {
  constructor(@inject(AccountTypes.auth) private authService: AuthService) {}

  @httpPost('/login')
  private async login(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    res.send(await this.authService.login(req.body))
  }

  @httpPost('/signup')
  private async signup(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    res.send(await this.authService.createUserDetails(req.body))
  }
}
