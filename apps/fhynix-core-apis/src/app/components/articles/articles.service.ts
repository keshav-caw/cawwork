import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { ArticleServiceInterface } from '../../common/interfaces/article-service.interface'
import { ArticleRepository } from './article.repository'
import { ArticleModel } from '../../common/models/article.model'
import { ArticlePaginationModel } from '../../common/models/article-pagination.model'
import { AuthRepository } from '../accounts/auth.repository'
import { CommonTypes } from '../../common/common.types'
import { LinkPreviewProvider } from '../../common/linkPreviewProvider/linkPreview.provider'

@injectable()
export class ArticleService implements ArticleServiceInterface {
  constructor(
    @inject('ArticleRepository') private articleRepository: ArticleRepository,
    @inject('AuthRepository') private authRepository: AuthRepository,
    @inject(CommonTypes.linkPreview) private linkPreviewProvider: LinkPreviewProvider
  ) {}

  async getArticles(details:ArticlePaginationModel) {
      return await this.articleRepository.getArticles(details);
  }

  async addArticle(url) {
    await this.authRepository.rejectIfNotAdmin();

    const articleData = await this.linkPreviewProvider.getPreview(url);

    const newArticle = await this.articleRepository.addArticle(articleData);
    return newArticle;
  }
}
