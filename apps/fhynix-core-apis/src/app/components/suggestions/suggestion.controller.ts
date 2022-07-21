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
import { SuggestionTypes } from './suggestion.types'
import { SuggestionService } from './suggestion.service'
import { CommonTypes } from '../../common/common.types'
import { PaginatedResponsePayload } from 'apps/shared/payloads/api-paginated-response.payload'
import { ArticleResponsePayload } from 'apps/shared/payloads/article-response.payload'
import { CommonContainer } from '../../common/container'
import { RequestContext } from '../../common/jwtservice/requests-context.service'
import { SuggestionResponsePayload } from 'apps/shared/payloads/suggestion-response.payload'
import { ArticleModel } from '../../common/models/article.model'
import { ProductModel } from '../../common/models/product.model'
import { MovieModel, RestaurantModel, VendorModel } from '../../common/models/activity.model'

@controller('/suggestions')
export class SuggestionController implements interfaces.Controller {
  private readonly requestContext = CommonContainer.get<RequestContext>(
    CommonTypes.requestContext,
  )
  constructor(
    @inject(SuggestionTypes.suggestions) private suggestionService: SuggestionService,
  ) {}

  @httpGet('/articles/list', CommonTypes.jwtAuthMiddleware)
  private async getArticles(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ) {
    const pageNumber = +req.query.pageNumber
    const pageSize = +req.query.pageSize

    const articles = await this.suggestionService.getArticles({
      pageNumber,
      pageSize,
    })
    const details = new PaginatedResponsePayload<ArticleResponsePayload>([])
    for (const article of articles) {
      const newArticle = new ArticleResponsePayload(
        article.id,
        article.title,
        article.imageUrl,
        article.url,
      )
      details.add(newArticle)
    }
    res.send(details)
  }

  @httpGet('/articles', CommonTypes.jwtAuthMiddleware)
  private async getArticlesToSuggest(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ) {
    const userId = this.requestContext.getUserId();

    const articles = await this.suggestionService.getArticlesToSuggest(userId);
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

  @httpPost(
    '/articles',
    CommonTypes.jwtAuthMiddleware,
    CommonTypes.checkAdminMiddleware,
  )
  private async addArticle(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ) {
    const { url,activityIds } = req.body
    const articleData = await this.suggestionService.addArticle(url,activityIds)
    res.send(articleData)
  }

  @httpGet('/articles/bookmarks', CommonTypes.jwtAuthMiddleware)
  private async getBookmarks(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ) {
    const userId = this.requestContext.getUserId()
    const articles = await this.suggestionService.getBookmarks(userId)
    const details = new PaginatedResponsePayload<ArticleResponsePayload>([])
    for (const article of articles) {
      const newArticle = new ArticleResponsePayload(
        article.id,
        article.title,
        article.imageUrl,
        article.url,
      )
      details.add(newArticle)
    }
    res.send(details)
  }

  @httpPost('/articles/:id/add-bookmark', CommonTypes.jwtAuthMiddleware)
  private async addBookmark(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ) {
    const articleId = req.params.id
    const userId = this.requestContext.getUserId()
    const bookmark = await this.suggestionService.addBookmark(userId, articleId)
    res.send(bookmark)
  }

  @httpPost('/articles/:id/remove-bookmark', CommonTypes.jwtAuthMiddleware)
  private async removeBookmark(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ) {
    const articleId = req.params.id
    const userId = this.requestContext.getUserId()

    const bookmark = await this.suggestionService.removeBookmark(userId, articleId)
    res.send(bookmark)
  }

  @httpPost('/products',CommonTypes.jwtAuthMiddleware,CommonTypes.checkAdminMiddleware)
  private async addProduct(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ){
    const {url,activityIds,price} = req.body;
    const productData = await this.suggestionService.addProduct(url,price,activityIds);
    res.send(productData);
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
