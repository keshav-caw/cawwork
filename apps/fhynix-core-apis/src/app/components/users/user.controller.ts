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
import { UserTypes } from './user.types'
import { CommonTypes } from '../../common/common.types'
import { RequestContext } from '../../common/jwtservice/requests-context.service'
import { AccountTypes } from '../accounts/account.types'
import { AuthService } from '../accounts/auth.service'

@controller('/users')
export class UserController implements interfaces.Controller {
  constructor(
    @inject(UserTypes.user) private userService: UserService,
    @inject(AccountTypes.auth) private authService: AuthService,
    @inject(CommonTypes.requestContext)
    private requestContext: RequestContext,
  ) {}

  @httpGet('/me', CommonTypes.jwtAuthMiddleware)
  public async getFamilYMembers(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    const userId = this.requestContext.getUserId()
    const details = await this.userService.getUserDetail(userId)
    return res.send(details)
  }

  @httpGet('/my/contacts/search', CommonTypes.jwtAuthMiddleware)
  public async searchContacts(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    const userId = this.requestContext.getUserId()
    const userDetails = await this.userService.getUserDetail(userId)
    const accountDetails = await this.authService.getAccountDetailsByUsername(
      userDetails[0].email,
    )
    const contacts = await this.userService.searchContacts(
      accountDetails[0].accessToken,
      accountDetails[0].refreshToken,
      req.query.search.toString(),
    )
    return res.send(contacts)
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
    if (req.query.isOnboardingCompleted) {
      const userId = this.requestContext.getUserId()
      await this.userService.updateUserDetails(
        { isOnboardingCompleted: true },
        userId,
      )
    }
    res.send(details)
  }
}
