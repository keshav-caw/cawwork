import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { ArticleServiceInterface } from '../../common/interfaces/article-service.interface'
import { ArticleRepository } from './article.repository'
import { ArticleModel } from '../../common/models/article-model'
import { ArticlePaginationModel } from '../../common/models/article-pagination-model'
import { ArticlePayload } from '../../../../../shared/payloads/article-payload';

@injectable()
export class ArticleService implements ArticleServiceInterface {
  constructor(
    @inject('ArticleRepository') private articleRepository: ArticleRepository,
  ) {}

  async getArticles(details:ArticlePaginationModel) {
      const articles = await this.articleRepository.getArticles(details);
      const allArticles = [];
      for(const article of articles){
          const newArticle = new ArticlePayload(
              article.title,
              article.imageUrl,
              article.url
          )
          allArticles.push(newArticle);
      }
      return allArticles;
  }
}
