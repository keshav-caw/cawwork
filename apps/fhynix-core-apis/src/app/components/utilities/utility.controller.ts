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
import { PaginatedResponsePayload } from 'apps/shared/payloads/api-paginated-response.payload'
import { SearchLocationPayload } from 'apps/shared/payloads/search-location.payload'
import { icalGenerator } from './ical.helper'

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
    const nearbyPlaceNames = new PaginatedResponsePayload<SearchLocationPayload>();
    nearbyPlaces.data.results.forEach(result => {
      const searchLocation = new SearchLocationPayload(result.name,result.geometry.location);
      nearbyPlaceNames.add(searchLocation);
    });
    
    res.send(nearbyPlaceNames);
  }

}
