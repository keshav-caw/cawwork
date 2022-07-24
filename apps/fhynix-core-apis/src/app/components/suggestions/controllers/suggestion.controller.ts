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
import { MovieModel, RestaurantModel, VendorModel } from '../../../common/models/activity.model'
import { CommonContainer } from '../../../common/container'
import { RequestContext } from '../../../common/jwtservice/requests-context.service'
import { ArticleService } from '../services/articles.service'
import { ArticleResponsePayload } from 'apps/shared/payloads/article-response.payload'

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

    const articlePayload = new PaginatedResponsePayload<ArticleModel> (response.articles);
    const productPayload = new PaginatedResponsePayload<ProductModel> (response.products);
    const vendorPayload = new PaginatedResponsePayload<VendorModel> (response.vendors);
    const restaurantPayload = new PaginatedResponsePayload<RestaurantModel> (response.restaurants);
    const moviePayload = new PaginatedResponsePayload<MovieModel> (response.movies);
    
    const responsePayload = new SuggestionResponsePayload (articlePayload,productPayload,vendorPayload,restaurantPayload,moviePayload);
    res.send(responsePayload);
  }
}
