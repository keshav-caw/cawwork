import { LocationSearchQueryModel } from "../models/location-search-query.model";

export interface LocationServiceInterface {
  getNearbyPlaces(details:LocationSearchQueryModel)
}
