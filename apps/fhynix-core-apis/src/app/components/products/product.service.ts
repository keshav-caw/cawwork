import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { CommonTypes } from '../../common/common.types'
import { LinkPreviewProvider } from '../../common/linkPreviewProvider/linkPreview.provider'
import { ArgumentValidationError } from '../../common/errors/custom-errors/argument-validation.error'
import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { ProductServiceInterface } from '../../common/interfaces/product-service.interface'
import { ProductRepository } from './product.repository'

@injectable()
export class ProductService implements ProductServiceInterface {

  constructor(
    @inject('ProductRepository') private productRepository: ProductRepository,
    @inject(CommonTypes.linkPreview) private linkPreviewProvider: LinkPreviewProvider,
  ) {}


  async addProduct(url,activityIds,price) {
    const newProduct = await this.linkPreviewProvider.getPreview(url);

    if(!newProduct.title || !newProduct.imageUrl){
      throw new ArgumentValidationError(
        'linkPreview Data',
        newProduct,
        ApiErrorCode.E0015
      )
    }

    newProduct.activityIds = activityIds
    newProduct.price = price

    const Product = await this.productRepository.addProduct(newProduct);
    return Product;
  }
}
