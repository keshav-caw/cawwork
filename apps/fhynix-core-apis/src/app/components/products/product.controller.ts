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
import { ProductTypes } from './product.types'
import { ProductService } from './product.service'
import { CommonTypes } from '../../common/common.types'
import { CommonContainer } from '../../common/container'
import { RequestContext } from '../../common/jwtservice/requests-context.service'

@controller('/products')
export class ProductController implements interfaces.Controller {
  private readonly requestContext = CommonContainer.get<RequestContext>(
    CommonTypes.requestContext,
  )
  constructor(
    @inject(ProductTypes.product) private productService: ProductService,
  ) {}


  @httpPost('/push',CommonTypes.jwtAuthMiddleware,CommonTypes.checkAdminMiddleware)
  private async addProduct(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ){
    const {url,activityIds,price} = req.body;
    const productData = await this.productService.addProduct(url,activityIds,price);
    res.send(productData);
  }

}
