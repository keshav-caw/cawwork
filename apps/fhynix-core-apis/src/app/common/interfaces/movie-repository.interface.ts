import { MovieModel } from "../models/movie.model";
import { PaginationModel } from "../models/pagination.model";


export interface MovieRepositoryInterface {
    getMoviesAssociatedToActivityId(activityId:string,details:PaginationModel): Promise<MovieModel[]>
}
