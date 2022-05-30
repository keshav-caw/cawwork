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

@controller('/auth')
export class AuthController implements interfaces.Controller {
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
    // console.log(details);
    
    res.send(details);   
  }
}
