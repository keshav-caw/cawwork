import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { ArticleServiceInterface } from '../../common/interfaces/article-service.interface'
import { ArticleRepository } from './article.repository'
import { ArticleModel } from '../../common/models/article-model'
import { ArticlePaginationModel } from '../../common/models/article-pagination-model'

@injectable()
export class ArticleService implements ArticleServiceInterface {
  constructor(
    @inject('ArticleRepository') private articleRepository: ArticleRepository,
  ) {}

  async getArticles(details:ArticlePaginationModel) {
      return await this.articleRepository.getArticles(details);
  }
}
