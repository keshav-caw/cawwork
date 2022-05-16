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
import { SignupService } from './signup.service'

@controller('/auth')
export class AuthController implements interfaces.Controller {
  constructor(
    @inject(AccountTypes.auth) private authService: AuthService,
    @inject(AccountTypes.signup) private signupService:SignupService
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
    const details = await this.signupService.signup(req.body);
    res.send(details);   
  }
}
