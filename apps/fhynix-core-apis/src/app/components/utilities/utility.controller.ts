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
import { GoogleLocationService } from './utilities.service'
import { CollectionResponsePayload } from 'apps/shared/payloads/api-collection-response-payload'

@controller('/utilities')
export class UtilityController implements interfaces.Controller {
  constructor(
    @inject(UtilityTypes.googleLocations) private googleLocationService: GoogleLocationService,
  ) {}

  @httpGet('/location/search',CommonTypes.jwtAuthMiddleware)
  private async getNearbyPlaces(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ) { 
    const {fromLatitude,fromLongitude,locationQuery} = req.body;
    const nearbyPlaces = await this.googleLocationService.getNearbyPlaces({fromLatitude,fromLongitude,locationQuery});
    const nearbyPlaceNames = new CollectionResponsePayload<String>();
    nearbyPlaces.data.results.forEach(result => {
      nearbyPlaceNames.add(result.name);
    });
    
    res.send(nearbyPlaceNames);
  }

}
