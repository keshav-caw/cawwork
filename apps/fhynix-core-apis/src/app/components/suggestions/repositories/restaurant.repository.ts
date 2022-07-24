import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../../common/data/datastore'
import { RestaurantRepositoryInterface } from '../../../common/interfaces/restaurant-repository.interface'
import { RestaurantModel } from '../../../common/models/activity.model'
import { PaginationModel } from '../../../common/models/pagination.model'

@injectable()
export class RestaurantRepository implements RestaurantRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getRestaurantsAssociatedToActivityId(details:PaginationModel,activityId:string): Promise<RestaurantModel[]> {
    const result = await this.client.restaurants?.findMany({
        skip:(details.pageNumber-1)*(details.pageSize),
        take:details.pageSize,
        where:{
            activityIds:{
                hasSome:activityId
            }
        },
    },
    {
      select: {
        id:true,
        name: true,
        activityIds:true,
        phoneNumbers:true,
        address:true,
        imageUrl:true
      }
    })
    
    return result ? result : []
  }
}
