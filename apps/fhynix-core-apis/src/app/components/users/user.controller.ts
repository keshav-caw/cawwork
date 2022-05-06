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
  requestParam,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { UserService } from './user.service'
import { JWTService } from '../../common/jwtservice/jwt.service'
import { UserTypes } from './user.types'
import { CommonTypes } from '../../common/common.types'
import { RequestContext } from '../../common/jwtservice/auth-store.service'

@controller('/users')
export class UserController implements interfaces.Controller {
  constructor(
    @inject(UserTypes.user) private userService: UserService,
    @inject(CommonTypes.jwt) private jwtService: JWTService,
    @inject(CommonTypes.authStoreService)
    private authStoreService: RequestContext,
  ) {}

  @httpGet('/me', CommonTypes.jwtAuthMiddleware)
  public async getUsers(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    const userId = this.authStoreService.getUserId()
    const details = await this.userService.getUserDetail(userId)
    return res.send(details)
  }

  @httpPost('/')
  private async createUser(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    res.send(await this.userService.createUser(req.body))
  }

  @httpPut('/me', CommonTypes.jwtAuthMiddleware)
  private async updateUser(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const details = await this.userService.updateFamilyMembers(
      req.body,
      req.query.memberId.toString(),
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
