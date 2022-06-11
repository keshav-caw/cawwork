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
import { ArticleTypes } from './article.types'
import { ArticleService } from './articles.service'
import { CommonTypes } from '../../common/common.types'
import { PaginatedResponsePayload } from 'apps/shared/payloads/api-paginated-response.payload'
import { ArticleResponsePayload } from 'apps/shared/payloads/article-response.payload'
import { CommonContainer } from '../../common/container'
import { RequestContext } from '../../common/jwtservice/requests-context.service'

@controller('/articles')
export class ArticleController implements interfaces.Controller {
  private readonly requestContext = CommonContainer.get<RequestContext>(
    CommonTypes.requestContext,
  )
  constructor(
    @inject(ArticleTypes.articles) private articleService: ArticleService,
  ) {}

  @httpGet('/list', CommonTypes.jwtAuthMiddleware)
  private async getArticles(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ) {
    const pageNumber = +req.query.pageNumber
    const pageSize = +req.query.pageSize

    const articles = await this.articleService.getArticles({
      pageNumber,
      pageSize,
    })
    const details = new PaginatedResponsePayload<ArticleResponsePayload>()
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

  @httpPost(
    '/push',
    CommonTypes.jwtAuthMiddleware,
    CommonTypes.checkAdminMiddleware,
  )
  private async addArticle(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ) {
    const { url } = req.body
    const articleData = await this.articleService.addArticle(url)
    res.send(articleData)
  }

  @httpGet('/bookmarks', CommonTypes.jwtAuthMiddleware)
  private async getBookmarks(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ) {
    const userId = this.requestContext.getUserId()
    const articles = await this.articleService.getBookmarks(userId)
    const details = new PaginatedResponsePayload<ArticleResponsePayload>()
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

  @httpPost('/:id/add-bookmark', CommonTypes.jwtAuthMiddleware)
  private async addBookmark(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ) {
    const articleId = req.params.id
    const userId = this.requestContext.getUserId()
    const bookmark = await this.articleService.addBookmark(userId, articleId)
    res.send(bookmark)
  }

  @httpPost('/:id/remove-bookmark', CommonTypes.jwtAuthMiddleware)
  private async removeBookmark(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ) {
    const articleId = req.params.id
    const userId = this.requestContext.getUserId()

    const bookmark = await this.articleService.removeBookmark(userId, articleId)
    res.send(bookmark)
  }
}
