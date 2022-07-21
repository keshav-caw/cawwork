import { MovieModel } from "../models/activity.model";
import { PaginationModel } from "../models/pagination.model";


export interface MovieRepositoryInterface {
  getMovies(details:PaginationModel): Promise<MovieModel[]>
}
