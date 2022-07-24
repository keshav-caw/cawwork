import { RestaurantModel } from "../models/activity.model";
import { PaginationModel } from "../models/pagination.model";


export interface RestaurantRepositoryInterface {
    getRestaurantsAssociatedToActivityId(details:PaginationModel,activityId:string): Promise<RestaurantModel[]>
}
