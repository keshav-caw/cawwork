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
import { CollectionResponsePayload } from 'apps/shared/payloads/api-collection-response-payload'
import { ArticleResponsePayload } from 'apps/shared/payloads/article-response-payload'
import jwtMiddleWare from '../../middlewares/jwt-auth.middleware'

@controller('/articles')
export class ArticleController implements interfaces.Controller {
  constructor(
    @inject(ArticleTypes.articles) private articleService: ArticleService,
  ) {}

  @httpGet('/list',jwtMiddleWare)
  private async getArticles(
    @request() req: express.Request,
    @response() res: express.Response,
  ) {
    const {pageNumber,pageSize} = req.body;
    const articles = await this.articleService.getArticles({pageNumber,pageSize});
    const details = new CollectionResponsePayload<ArticleResponsePayload>();
    for(const article of articles){
        const newArticle = new ArticleResponsePayload(article.title,article.imageUrl,article.url);
        details.add(newArticle);
    }
    res.send(details)
  }

}
