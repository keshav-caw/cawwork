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
import jwtMiddleWare from '../../middlewares/jwt-auth.middleware'
import { ArticleRepository } from './article.repository'
import { LinkPreviewProvider } from '../../common/linkPreviewProvider/linkPreview.provider'

@controller('/articles')
export class ArticleController implements interfaces.Controller {
  constructor(
    @inject(ArticleTypes.articles) private articleService: ArticleService,
    @inject('ArticleRepository') private articleRepository: ArticleRepository,
    @inject(CommonTypes.linkPreview) private linkPreviewProvider: LinkPreviewProvider,
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

  @httpPost('/push',CommonTypes.jwtAuthMiddleware)
  private async addArticle(
    @request() req: express.Request,
    @response() res: express.Response,
    @next() next: express.NextFunction,
  ){
    const {url} = req.body;
    const articleData = await this.linkPreviewProvider.getPreview(url);
    res.send(articleData);
  }

}
