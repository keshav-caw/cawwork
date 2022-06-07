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
    const bookmarks = await this.articleRepository.getBookmarks(userId);
    const details = [];
    for(let i=0;i<bookmarks.articleIds.length;i++){
      const article:ArticleModel = await this.articleRepository.getArticleDetailsById(bookmarks.articleIds[i]);
      details.push(article);
      if(i===bookmarks.articleIds.length-1)return details;
    }
    return details;
  }

  async addBookmark(userId,articleId){
    const bookmarks = await this.articleRepository.getBookmarks(userId);
    bookmarks.articleIds.push(articleId);
    const result = await this.articleRepository.upsertBookmarks(userId,bookmarks);
    return result;
  }

  async removeBookmark(userId,leavingArticleId){
    const bookmarks = await this.articleRepository.getBookmarks(userId);
    const newArticleIds = bookmarks.articleIds.filter((articleId)=> articleId!==leavingArticleId);
    bookmarks.articleIds = newArticleIds;
    const result = await this.articleRepository.upsertBookmarks(userId,bookmarks);
    return result;
  }
}
