import * as express from 'express'
import {
  interfaces,
  controller,
  httpPost,
  request,
  response,
  httpGet,
  next
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { SuggestionTypes } from '../suggestion.types'
import { ProductService } from '../services/product.service'
import { CommonTypes } from '../../../common/common.types'

@controller('/products')
export class ProductController implements interfaces.Controller {
  constructor(
    @inject(SuggestionTypes.product) private productService: ProductService,
  ) {}


  @httpPost('/',CommonTypes.jwtAuthMiddleware,CommonTypes.checkAdminMiddleware)
  private async addProduct(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ){
    const {url,activityIds,price} = req.body;
    const productData = await this.productService.addProduct(url,price,activityIds);
    res.send(productData);
  }
}