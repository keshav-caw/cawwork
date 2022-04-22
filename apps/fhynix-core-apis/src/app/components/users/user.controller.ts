import * as express from 'express'
import {
  interfaces,
  controller,
  httpGet,
  request,
  response,
  next,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { UserService } from './user.service'
import { JWTService } from '../../common/jwtservice/jwt.service'
import { UserTypes } from './user.types'
import { CommonTypes } from '../../common/common.types'

@controller('/user')
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
    const details = await this.userService.getUsers(req?.query?.id)
    return res.send(details)
  }
}
