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
import { AuthStoreService } from '../../common/jwtservice/auth-store.service'

@controller('/contact/me')
export class UserController implements interfaces.Controller {
  constructor(
    @inject(UserTypes.user) private userService: UserService,
    @inject(CommonTypes.jwt) private jwtService: JWTService,
    @inject(CommonTypes.authStoreService)
    private authStoreService: AuthStoreService,
  ) {}

  @httpGet('/', CommonTypes.jwtAuthMiddleware)
  public async getUsers(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    const authTokenInfo = this.authStoreService.getAuthTokenInfo()
    console.log(authTokenInfo)
    const details = await this.userService.getUsers(authTokenInfo?.userId)
    return res.send(details)
  }

  @httpPost('/')
  private async createUser(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    res.send(await this.userService.createUser(req.body))
  }

  @httpPut('/', CommonTypes.jwtAuthMiddleware)
  private async updateUser(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const authTokenInfo = this.authStoreService.getAuthTokenInfo()
    const details = await this.userService.updateUserDetails(
      req.body,
      authTokenInfo?.userId,
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
