import * as express from 'express'
import {
  interfaces,
  controller,
  httpPost,
  request,
  response,
  httpGet,
  next
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { CommonTypes } from '../../common/common.types'
import { UtilityTypes } from './utility.types'
import { UtilityService } from './utilities.service'

@controller('/utilities')
export class UtilityController implements interfaces.Controller {
  constructor(
    @inject(UtilityTypes.utlities) private utilityService: UtilityService,
  ) {}

  @httpGet('/location/search',CommonTypes.jwtAuthMiddleware)
  private async getNearbyPlaces(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ) { 
    const {latitude,longitude,placeText} = req.body;
    const nearbyPlaces = await this.utilityService.getNearbyPlaces({latitude,longitude,placeText});
    const nearbyPlaceNames = nearbyPlaces.data.results.map(result=>result.name);
    
    res.send(nearbyPlaceNames);
  }

}
