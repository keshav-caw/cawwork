import * as express from 'express'
import {
  interfaces,
  controller,
  request,
  response,
  httpPost,
  httpGet,
  next,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { CommonTypes } from '../../common/common.types'
import { FamilyMemberService } from './family-member.service'
import { FamilyMemberTypes } from './family-member.types'
import { RequestContext } from '../../common/jwtservice/requests-context.service'

@controller('/family-members')
export class FamilyMemberController implements interfaces.Controller {
  constructor(
    @inject(FamilyMemberTypes.familyMember)
    private familyMemberService: FamilyMemberService,
    @inject(CommonTypes.requestContext)
    private requestContext: RequestContext,
  ) {}

  @httpGet('/', CommonTypes.jwtAuthMiddleware)
  public async getUsers(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    const userId = this.requestContext.getUserId()
    const details = await this.familyMemberService.getFamilyMembers(userId)
    return res.send(details)
  }

  @httpPost('/', CommonTypes.jwtAuthMiddleware)
  private async createUser(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const userId = this.requestContext.getUserId()
    res.send(await this.familyMemberService.createFamilyMemberForUser(req.body))
  }
}