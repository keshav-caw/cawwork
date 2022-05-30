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
import { LocationProvider } from './location.provider'
import { PaginatedResponsePayload } from 'apps/shared/payloads/api-paginated-response.payload'
import { SearchLocationPayload } from 'apps/shared/payloads/search-location.payload'
import axios from 'axios'
import { AddressModel } from '../../common/models/address.model'

@controller('/utilities')
export class UtilityController implements interfaces.Controller {
  constructor(
    @inject(UtilityTypes.googleLocations) private locationProvider: LocationProvider,
  ) {}

  @httpGet('/location/search',CommonTypes.jwtAuthMiddleware)
  private async getNearbyPlaces(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ) { 
    const {fromLatitude,fromLongitude,locationQuery} = req.body;
    const addresses = await this.locationProvider.getNearbyPlaces({fromLatitude,fromLongitude,locationQuery});
    const nearbyPlaceNames = new PaginatedResponsePayload<SearchLocationPayload>();

    for(const address of addresses){
      const searchLocation = new SearchLocationPayload(address);
      nearbyPlaceNames.add(searchLocation);
    }
    
    res.send(nearbyPlaceNames);
  }

}
