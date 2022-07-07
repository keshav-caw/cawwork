import * as express from 'express'
import {
  interfaces,
  controller,
  request,
  response,
  httpGet,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { CommonTypes } from '../../common/common.types'
import { InsightTypes } from './insight.types'
import { InsightService } from './insight.service'
import { RequestContext } from '../../common/jwtservice/requests-context.service'

@controller('/insights')
export class InsightController implements interfaces.Controller {
  constructor(
    @inject(InsightTypes.insight)
    private insightService: InsightService,
    @inject(CommonTypes.requestContext)
    private requestContext: RequestContext,
  ) {}

  @httpGet('/mine', CommonTypes.jwtAuthMiddleware)
  private async getInsightsOfUser(@response() res: express.Response) {
    const userId = this.requestContext.getUserId()
    res.send(await this.insightService.getInsights(userId))
  }

  @httpGet('/my-cohort', CommonTypes.jwtAuthMiddleware)
  private async getInsightCohortsOfUser(@response() res: express.Response) {
    res.send(await this.insightService.getInsightsOfOthers())
  }
}
