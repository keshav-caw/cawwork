import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { ArticleServiceInterface } from '../../common/interfaces/article-service.interface'
import { ArticleRepository } from './article.repository'
import { ArticleModel } from '../../common/models/article.model'
import { ArticlePaginationModel } from '../../common/models/article-pagination.model'
import { AuthRepository } from '../accounts/auth.repository'
import { CommonTypes } from '../../common/common.types'
import { LinkPreviewProvider } from '../../common/linkPreviewProvider/linkPreview.provider'
import { ArgumentValidationError } from '../../common/errors/custom-errors/argument-validation.error'
import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { ArticleResponsePayload } from 'apps/shared/payloads/article-response.payload'
import { PaginatedResponsePayload } from 'apps/shared/payloads/api-paginated-response.payload'
import { ArticleBookmarkModel } from '../../common/models/articleBookmark.model'

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

    const newArticle = await this.linkPreviewProvider.getPreview(url);

    if(!newArticle.title || !newArticle.imageUrl){
      throw new ArgumentValidationError(
        'linkPreview Data',
        newArticle,
        ApiErrorCode.E0015
      )
    }

    const article = await this.articleRepository.addArticle(newArticle);
    return article;
  }

  async getBookmarks(userId){
    const details = await this.articleRepository.getArticlesBookmarkedByUser(userId);
    return details;
  }

  async addBookmark(userId,articleId){
    const bookmark:ArticleBookmarkModel = {
      userId:userId,
      articleId:articleId,
      isDeleted:false,
      updatedAtUtc:new Date()
    }

    const result = await this.articleRepository.upsertBookmark(bookmark)
    return result
  }

  async removeBookmark(userId,articleId){
    const bookmark:ArticleBookmarkModel = {
      userId:userId,
      articleId:articleId,
      isDeleted:true,
      updatedAtUtc: new Date()
    }

    const result = await this.articleRepository.removeBookmark(bookmark);
    return result;
  }
}
