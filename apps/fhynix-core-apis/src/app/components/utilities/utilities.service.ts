import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import axios from 'axios';
import { LocationServiceInterface } from '../../common/interfaces/location-service.interface'
import { LocationSearchQueryModel } from '../../common/models/location-search-query.model'
import {environment} from '../../../environments/environment';
import { AddressModel } from '../../common/models/address.model';

@injectable()
export class GoogleLocationService implements LocationServiceInterface {
  private NEARBY_SEARCH_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';

  async getNearbyPlaces(details:LocationSearchQueryModel) {

    const {fromLatitude,fromLongitude,locationQuery} = details;

      const fetchUrl = `${this.NEARBY_SEARCH_URL}?radius=${environment.locationSearchRadiusInMeters}&location=${fromLatitude}%2C${fromLongitude}&key=${environment.googleLocationSearchApiKey}&keyword=${locationQuery}`;

      const nearbyPlaces = await axios(fetchUrl);

      const addresses:AddressModel[] = [];

      for(const result of nearbyPlaces.data.results){
        const address:AddressModel = {
          name:result.name,
          streetInfo:"NA",
          city:"NA",
          state:"NA",
          country:"NA",
          lat:result.geometry.location.lat,
          lng:result.geometry.location.lng
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
        addresses.push(address);
      }
      
      return addresses;
  }
}
