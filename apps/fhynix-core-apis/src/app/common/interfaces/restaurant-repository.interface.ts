import { RestaurantModel } from "../models/restaurant.model";
import { PaginationModel } from "../models/pagination.model";


export interface RestaurantRepositoryInterface {
    getRestaurantsAssociatedToActivityId(activityId:string,latitude:number,longitude:number,details:PaginationModel): Promise<RestaurantModel[]>
}
