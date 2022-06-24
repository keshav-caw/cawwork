import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { ProductRepositoryInterface } from '../../common/interfaces/product-repository.interface'
import { ProductServiceInterface } from '../../common/interfaces/product-service.interface'
import { ProductController } from './product.controller'
import { ProductRepository } from './product.repository'
import { ProductService } from './product.service'
import { ProductTypes } from './product.types'

@injectable()
export default class ProductBootstrapper {
  public static initialize() {
      CommonContainer.bind<ProductRepositoryInterface>('ProductRepository').to(ProductRepository)
      CommonContainer.bind<ProductServiceInterface>(ProductTypes.product).to(ProductService)
      CommonContainer.bind<ProductController>('ProductController').to(ProductController)
  }
}
