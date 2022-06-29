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
import { ActivityService } from './activity.service'
import { ActivityTypes } from './activity.types'
import { RequestContext } from '../../common/jwtservice/requests-context.service'

@controller('/activities')
export class ActivityController implements interfaces.Controller {
  constructor(
    @inject(ActivityTypes.activity) private activityService: ActivityService,
    @inject(CommonTypes.jwt) private jwtService: JWTService,
    @inject(CommonTypes.requestContext)
    private authStoreService: RequestContext,
  ) {}

  @httpGet('/', CommonTypes.jwtAuthMiddleware)
  public async getActivitiesByRelationship(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ): Promise<any> {
    let details
    if (req.query.canBeHabit) {
      details = await this.activityService.getActivityByRelationship(
        req.query.relationship.toString(),
      )
    } else {
      details = await this.activityService.getAllActivities()
    }

    return res.send(details)
  }

  @httpPost('/')
  private async createRelationshiActivity(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    res.send(
      await this.activityService.createActivitiesForRelationship(req.body),
    )
  }
}
