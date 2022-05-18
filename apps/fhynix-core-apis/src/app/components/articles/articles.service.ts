import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { ArticleServiceInterface } from '../../common/interfaces/article-service.interface'
import { ArticleRepository } from './article.repository'
import { ArticleModel } from '../../common/models/article-model'
import { ArticlePaginationModel } from '../../common/models/article-pagination-model'
import { CollectionResponsePayload } from '../../../../../shared/payloads/api-collection-response-payload';
import { ArticlePayload } from 'apps/shared/payloads/article-payload'

@injectable()
export class ArticleService implements ArticleServiceInterface {
  constructor(
    @inject('ArticleRepository') private articleRepository: ArticleRepository,
  ) {}

  async getArticles(details:ArticlePaginationModel) {
      const articles = await this.articleRepository.getArticles(details);
      const result = new CollectionResponsePayload();
      for(const article of articles){
          const newArticle = new ArticlePayload(article.title,article.imageUrl,article.url);
          result.add(newArticle);
      }
      return result;
  }
}
