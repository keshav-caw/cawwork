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
import { ArticleTypes } from './article.types'
import { ArticleService } from './articles.service'
import { CommonTypes } from '../../common/common.types'
import { PaginatedResponsePayload } from 'apps/shared/payloads/api-paginated-response.payload'
import { ArticleResponsePayload } from 'apps/shared/payloads/article-response.payload'

@controller('/articles')
export class ArticleController implements interfaces.Controller {
  constructor(
    @inject(ArticleTypes.articles) private articleService: ArticleService,
  ) {}

  @httpGet('/list',CommonTypes.jwtAuthMiddleware)
  private async getArticles(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ) { 
    
    const {pageNumber,pageSize} = req.body;
    const articles = await this.articleService.getArticles({pageNumber,pageSize});
    const details = new PaginatedResponsePayload<ArticleResponsePayload>();
    for(const article of articles){
        const newArticle = new ArticleResponsePayload(article.title,article.imageUrl,article.url);
        details.add(newArticle);
    }
    res.send(details)
  }

  @httpPost('/push',CommonTypes.jwtAuthMiddleware,CommonTypes.checkAdminMiddleWare)
  private async addArticle(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ){
    const {url} = req.body;
    const articleData = await this.articleService.addArticle(url);
    res.send(articleData);
  }

}
