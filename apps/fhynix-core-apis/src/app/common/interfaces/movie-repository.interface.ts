import { MovieModel } from "../models/movie.model";
import { PaginationModel } from "../models/pagination.model";


export interface MovieRepositoryInterface {
    getMoviesAssociatedToActivityId(details:PaginationModel,activityId:string): Promise<MovieModel[]>
}
