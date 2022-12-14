import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../../common/data/datastore'
import { MovieRepositoryInterface } from '../../../common/interfaces/movie-repository.interface'
import { MovieModel } from '../../../common/models/movie.model'
import { PaginationModel } from '../../../common/models/pagination.model'

@injectable()
export class MovieRepository implements MovieRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getMoviesAssociatedToActivityId(activityId:string,details:PaginationModel): Promise<MovieModel[]> {
    const result = await this.client.movies?.findMany(
      {
        skip: (details.pageNumber - 1) * details.pageSize,
        take: details.pageSize,
        where:{
            activityIds:{
                hasSome:activityId
            }
        },
      },
      {
        select: {
          id: true,
          title: true,
          activityIds: true,
          description: true,
          language: true,
          runningTime: true,
          imageUrl: true,
        },
      },
    )
    return result ? result:[];
  }
}
