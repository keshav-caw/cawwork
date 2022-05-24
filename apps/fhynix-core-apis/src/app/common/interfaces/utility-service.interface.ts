import { CenterLocationModel } from "../models/center-location-model";

export interface UtilityServiceInterface {
  getNearbyPlaces(details:CenterLocationModel)
}
