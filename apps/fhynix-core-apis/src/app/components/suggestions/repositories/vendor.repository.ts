import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../../common/data/datastore'
import { VendorRepositoryInterface } from '../../../common/interfaces/vendor-repository.interface'
import { VendorModel } from '../../../common/models/vendor.model'
import { PaginationModel } from '../../../common/models/pagination.model'

@injectable()
export class VendorRepository implements VendorRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getVendorsAssociatedToActivityId(details:PaginationModel,activityId:string,latitude:number,longitude:number): Promise<VendorModel[]> {
    const result = await this.client.$queryRaw`select id,name, earth_distance(
      ll_to_earth(a.latitude, a.longitude),
      ll_to_earth(${latitude},${longitude})
    ) as distance,latitude,longitude,activity_ids,phone_numbers,address
    from public."Vendors" a
    where ${activityId}=ANY(activity_ids)
    order by distance
    LIMIT ${details.pageSize}`
    
    return result ? result : []
  }
}
