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
import { RelationshipTypes } from './realtionship.types'
import { RelationshipService } from './relationship.service'

@controller('/relationships')
export class RelationshipController implements interfaces.Controller {
  constructor(
    @inject(RelationshipTypes.relationship)
    private relationshipService: RelationshipService,
  ) {}

  @httpGet('/', CommonTypes.jwtAuthMiddleware)
  private async createUser(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    res.send(await this.relationshipService.getRelationships())
  }
}
