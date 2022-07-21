import { RestaurantModel } from "../models/activity.model";
import { PaginationModel } from "../models/pagination.model";


export interface RestaurantRepositoryInterface {
  getRestaurants(details:PaginationModel): Promise<RestaurantModel[]>
}
