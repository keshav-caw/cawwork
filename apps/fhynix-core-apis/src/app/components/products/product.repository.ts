import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../common/data/datastore'
import { ProductRepositoryInterface } from '../../common/interfaces/product-repository.interface'
import { ProductModel } from '../../common/models/product.model'

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
}
