import { LocationSearchQueryModel } from "../models/location-search-query.model";

export interface LocationProviderInterface {
  getNearbyPlaces(details:LocationSearchQueryModel)
}
