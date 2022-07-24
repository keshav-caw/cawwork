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

  async getVendorsAssociatedToActivityId(details:PaginationModel,activityId:string): Promise<VendorModel[]> {
    const result = await this.client.vendors?.findMany({
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
        address:true
      }
    })
    
    return result ? result : []
  }
}
