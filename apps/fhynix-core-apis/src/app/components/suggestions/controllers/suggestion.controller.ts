import * as express from 'express'
import {
  interfaces,
  controller,
  httpPost,
  request,
  response,
  httpGet,
  next,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { SuggestionTypes } from '../suggestion.types'
import { SuggestionService } from '../services/suggestion.service'
import { CommonTypes } from '../../../common/common.types'
import { PaginatedResponsePayload } from 'apps/shared/payloads/api-paginated-response.payload'
import { SuggestionResponsePayload } from 'apps/shared/payloads/suggestion-response.payload'
import { ArticleModel } from '../../../common/models/article.model'
import { ProductModel } from '../../../common/models/product.model'
import {MovieModel} from '../../../common/models/movie.model'
import {VendorModel} from '../../../common/models/vendor.model'
import {RestaurantModel} from '../../../common/models/restaurant.model'
import { CommonContainer } from '../../../common/container'
import { RequestContext } from '../../../common/jwtservice/requests-context.service'
import { ArticleService } from '../services/articles.service'
import { ArticleResponsePayload } from 'apps/shared/payloads/article-response.payload'
import { ProductResponsePayload } from 'apps/shared/payloads/product-response.payload'
import { VendorResponsePayload } from 'apps/shared/payloads/vendor-response.payload'
import { RestaurantResponsePayload } from 'apps/shared/payloads/restaurant-response.payload'
import { MovieResponsePayload } from 'apps/shared/payloads/movie-response.payload'

@controller('/suggestions')
export class SuggestionController implements interfaces.Controller {
  private readonly requestContext = CommonContainer.get<RequestContext>(
    CommonTypes.requestContext,
  )
  constructor(
    @inject(SuggestionTypes.suggestions) private suggestionService: SuggestionService,
    @inject(SuggestionTypes.articles) private articleService: ArticleService,
  ) {}

  @httpGet('/articles', CommonTypes.jwtAuthMiddleware)
  private async getArticlesToSuggest(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ) {
    const userId = this.requestContext.getUserId();

    const articles = await this.articleService.getArticlesToSuggest(userId);
    const details = [];
    for (const article of articles) {
      const newArticle = new ArticleResponsePayload(
        article.id,
        article.title,
        article.imageUrl,
        article.url,
      )
      details.push(newArticle)
    }
    res.send(details)
  }

  @httpGet('/activities/:id', CommonTypes.jwtAuthMiddleware)
  public async getSuggestionsForActivity(
    @request() req: express.Request,
    @response() res: express.Response,
  ){
    const activityId = req.params.id
    const response = await this.suggestionService.getSuggestionsForActivity(activityId);

    const articlePayloads:ArticleResponsePayload[] = [];
    for(const article of response.articles){
      const articlePayload = new ArticleResponsePayload(article.id,article.title,article.imageUrl,article.url,article.description,article.activityIds);
      articlePayloads.push(articlePayload);
    }

    const productPayloads:ProductResponsePayload[] = [];
    for(const product of response.products){
      const productPayload = new ProductResponsePayload(product.id,product.title,product.imageUrl,product.url,product.price,product.description,product.activityIds);
      productPayloads.push(productPayload);
    }

    const vendorPayloads:VendorResponsePayload[] = [];
    for(const vendor of response.vendors){
      const vendorPayload = new VendorResponsePayload(vendor.id,vendor.name,vendor.phoneNumbers,vendor.activityIds,vendor.address);
      vendorPayloads.push(vendorPayload);
    }

    const restaurantPayloads:RestaurantResponsePayload[] = [];
    for(const restaurant of response.restaurants){
      const restaurantPayload = new RestaurantResponsePayload(restaurant.id,restaurant.name,restaurant.address,restaurant.phoneNumbers,restaurant.imageUrl,restaurant.activityIds);
      restaurantPayloads.push(restaurantPayload);
    }

    const moviePayloads:MovieResponsePayload[] = [];
    for(const movie of response.movies){
      const moviePayload = new MovieResponsePayload(movie.id,movie.title,movie.activityIds,movie.imageUrl,movie.description,movie.language,movie.runningTime);
      moviePayloads.push(moviePayload);
    }
    
    const responsePayload = new SuggestionResponsePayload (articlePayloads,productPayloads,vendorPayloads,restaurantPayloads,moviePayloads);
    res.send(responsePayload);
  }
}
