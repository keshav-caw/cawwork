import * as express from 'express'
import {
  interfaces,
  controller,
  httpGet,
  request,
  response,
  next,
  httpPost,
  httpPut,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { UserService } from './user.service'
import { JWTService } from '../../common/jwtservice/jwt.service'
import { UserTypes } from './user.types'
import { CommonTypes } from '../../common/common.types'

@controller('/contact/me')
export class UserController implements interfaces.Controller {
  constructor(
    @inject(UserTypes.user) private userService: UserService,
    @inject(CommonTypes.jwt) private jwtService: JWTService,
  ) {}

  @httpGet('/')
  public async getUsers(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    try {
      this.jwtService.validate(req.headers.authorization)
    } catch (e) {
      return res.send({ status: 401, message: 'unauthorized' })
    }
    const tokenInfo = this.jwtService.decode(req.headers.authorization)
    const details = await this.userService.getUsers(tokenInfo?.user_id)
    return res.send(details)
  }

  @httpPost('/')
  private async createUser(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    res.send(await this.userService.createUser(req.body))
  }

  @httpPut('/')
  private async updateUser(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    try {
      this.jwtService.validate(req.headers.authorization)
    } catch (e) {
      return res.send({ status: 401, message: 'unauthorized' })
    }
    const tokenInfo = this.jwtService.decode(req.headers.authorization)
    const details = await this.userService.updateUserDetails(
      req.body,
      tokenInfo?.user_id,
    )
    res.send(details)
  }

  @httpGet('/test')
  public async getTestUser(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    return res.send('Hello World')
  }
}
