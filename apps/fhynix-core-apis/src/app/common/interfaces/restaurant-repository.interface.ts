import { RestaurantModel } from "../models/restaurant.model";
import { PaginationModel } from "../models/pagination.model";


export interface RestaurantRepositoryInterface {
    getRestaurantsAssociatedToActivityId(details:PaginationModel,activityId:string,latitude:number,longitude:number): Promise<RestaurantModel[]>
}
