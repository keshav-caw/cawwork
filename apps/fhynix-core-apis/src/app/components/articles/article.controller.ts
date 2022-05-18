import * as express from 'express'
import {
  interfaces,
  controller,
  httpPost,
  request,
  response,
  httpGet,
} from 'inversify-express-utils'
import { inject } from 'inversify'
import { ArticleTypes } from './article.types'
import { ArticleService } from './articles.service'
import { CommonTypes } from '../../common/common.types'

@controller('/articles')
export class ArticleController implements interfaces.Controller {
  constructor(
    @inject(ArticleTypes.articles) private articleService: ArticleService,
  ) {}

  @httpGet('/getAll',CommonTypes.jwtAuthMiddleware)
  private async getArticles(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const details = await this.articleService.getArticles();
    res.send(details)
  }

}
