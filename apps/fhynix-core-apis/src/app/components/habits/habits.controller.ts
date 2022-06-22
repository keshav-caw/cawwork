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
import { ActivityService } from './habits.service'
import { ActivityTypes } from './habits.types'
import { RequestContext } from '../../common/jwtservice/requests-context.service'

@controller('/habits')
export class HabitsController implements interfaces.Controller {
  constructor(
    @inject(ActivityTypes.activity) private activityService: ActivityService,
    @inject(CommonTypes.jwt) private jwtService: JWTService,
    @inject(CommonTypes.requestContext)
    private authStoreService: RequestContext,
  ) {}

  @httpGet('/', CommonTypes.jwtAuthMiddleware)
  public async getHabitsByRelationship(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    let details
    if (req.query.canBeHabit) {
      details = await this.activityService.getHabitsByRelationship(
        req.query.relationship.toString(),
      )
    } else {
      details = await this.activityService.getAllActivities()
    }

    return res.send(details)
  }

  @httpPost('/')
  private async createRelationshipHabits(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    res.send(await this.activityService.createHabitsForRelationship(req.body))
  }
}
