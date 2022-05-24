import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import axios from 'axios';
import { UtilityServiceInterface } from '../../common/interfaces/utility-service.interface'
import { CenterLocationModel } from '../../common/models/center-location-model'
import {environment} from '../../../environments/environment';


@injectable()
export class UtilityService implements UtilityServiceInterface {

  async getNearbyPlaces(details:CenterLocationModel) {
      const {latitude,longitude,placeText} = details;

      const fetchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?radius=${environment.searchRadius}&location=${latitude}%2C${longitude}&key=${environment.GOOGLE_LOCATION_SEARCH_API_KEY}&keyword=${placeText}`;

      const nearbyPlaces = await axios(fetchUrl);    
      return nearbyPlaces;
  }
}
