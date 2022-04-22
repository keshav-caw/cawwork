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
import { ServiceTypes } from '../../services/service.types'
import { JWTService } from '../../services/jwt.service'
import { UserTypes } from './user.types'

@controller('/user')
export class UserController implements interfaces.Controller {
  constructor(
    @inject(UserTypes.user) private userService: UserService,
    @inject(ServiceTypes.jwt) private jwtService: JWTService,
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
