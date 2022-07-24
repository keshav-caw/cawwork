import { MovieModel } from "../models/activity.model";
import { PaginationModel } from "../models/pagination.model";


export interface MovieRepositoryInterface {
    getMoviesAssociatedToActivityId(details:PaginationModel,activityId:string): Promise<MovieModel[]>
}
