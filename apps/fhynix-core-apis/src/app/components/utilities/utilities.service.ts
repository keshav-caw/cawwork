import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import axios from 'axios';
import { LocationServiceInterface } from '../../common/interfaces/location-service.interface'
import { LocationSearchQueryModel } from '../../common/models/location-search-query-model'
import {environment} from '../../../environments/environment';


@injectable()
export class GoogleLocationService implements LocationServiceInterface {
  private nearbySearchUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

  async getNearbyPlaces(details:LocationSearchQueryModel) {
      const {fromLatitude,fromLongitude,locationQuery} = details;

      const fetchUrl = `${this.nearbySearchUrl}?radius=${environment.searchRadius}&location=${fromLatitude}%2C${fromLongitude}&key=${environment.googleLocationSearchApiKey}&keyword=${locationQuery}`;

      const nearbyPlaces = await axios(fetchUrl);    
      return nearbyPlaces;
  }
}
