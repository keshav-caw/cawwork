import * as express from 'express'
import {
  interfaces,
  controller,
  httpGet,
  request,
  response,
  next,
  httpPost,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { JWTService } from '../../common/jwtservice/jwt.service'
import { CommonTypes } from '../../common/common.types'
import { RequestContext } from '../../common/jwtservice/auth-store.service'
import { HabitsService } from './habits.service'
import { HabitsTypes } from './habits.types'

@controller('/habits')
export class HabitsController implements interfaces.Controller {
  constructor(
    @inject(HabitsTypes.habits) private habitsService: HabitsService,
    @inject(CommonTypes.jwt) private jwtService: JWTService,
    @inject(CommonTypes.authStoreService)
    private authStoreService: RequestContext,
  ) {}

  @httpGet('/', CommonTypes.jwtAuthMiddleware)
  public async getHabitsByRelationship(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    const details = await this.habitsService.getHabitsByRelationship(
      req.body.relationship.toString(),
    )
    return res.send(details)
  }

  @httpPost('/')
  private async createRelationshipHabits(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    res.send(await this.habitsService.createRelationshipHabits(req.body))
  }
}
