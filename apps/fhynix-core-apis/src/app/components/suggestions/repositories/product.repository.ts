import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../../common/data/datastore'
import { ProductRepositoryInterface } from '../../../common/interfaces/product-repository.interface'
import { PaginationModel } from '../../../common/models/pagination.model'
import { ProductModel } from '../../../common/models/product.model'

@injectable()
export class ProductRepository implements ProductRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async addProduct(newProduct) {
    const product:ProductModel = await this.client.products?.create({
        data: newProduct,
    })

    return product;
  }

  async getProductsAssociatedToActivityId(activityId:string,details:PaginationModel): Promise<ProductModel[]> {
    const result = await this.client.products?.findMany({
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
        title: true,
        imageUrl:true,
        url:true,
        price:true
      }
    })
    
    return result ? result : []
  }
}
