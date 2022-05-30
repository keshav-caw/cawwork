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
import axios from 'axios'
import { AddressModel } from '../../common/models/address.model'

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

    for(const result of nearbyPlaces){
      const address:AddressModel = {
        streetInfo:"NA",
        city:"NA",
        state:"NA",
        country:"NA"
      };
      if(result["plus_code"]){
        const globalAddressArray = result["plus_code"]["compound_code"].split(",").reverse();
        address.city = globalAddressArray[2];
        address.state = globalAddressArray[1];
        address.country = globalAddressArray[0];
      }
      if(result.vicinity.split(",").length>1){
        const localAddressArray = result.vicinity.split(",");
        localAddressArray.pop();
        address.streetInfo = localAddressArray.join(",");
      }
      
      const searchLocation = new SearchLocationPayload(result.name,result.geometry.location,address);
      nearbyPlaceNames.add(searchLocation);
    }
    
    res.send(nearbyPlaceNames);
  }

}
