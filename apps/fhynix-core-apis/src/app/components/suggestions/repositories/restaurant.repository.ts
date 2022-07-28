import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../../common/data/datastore'
import { RestaurantRepositoryInterface } from '../../../common/interfaces/restaurant-repository.interface'
import { RestaurantModel } from '../../../common/models/restaurant.model'
import { PaginationModel } from '../../../common/models/pagination.model'

@injectable()
export class RestaurantRepository implements RestaurantRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getRestaurantsAssociatedToActivityId(activityId:string,latitude:number,longitude:number,details:PaginationModel): Promise<RestaurantModel[]> {
    const result = await this.client.$queryRaw`select id,name, earth_distance(
      ll_to_earth(a.latitude, a.longitude),
      ll_to_earth(${latitude},${longitude})
    ) as distance,latitude,longitude,activity_ids as "activityIds",phone_numbers as "phoneNumbers",address,image_url as "imageUrl"
    from public."Restaurants" a
    where ${activityId}=ANY(activity_ids)
    order by distance
    LIMIT ${details.pageSize}`
    
    return result ? result : []
  }
}
