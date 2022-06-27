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
import { FamilyMemberService } from '../family-member/family-member.service'
import { FamilyMemberTypes } from '../family-member/family-member.types'
import { RelationshipRepository } from '../relationship/relationship.repository'
import { ActivityRepository } from '../activity/activity.repository'
import {TaskTypes} from '../task/task.types'
import {TaskService} from '../task/task.service'

@injectable()
export class ArticleService implements ArticleServiceInterface {
  constructor(
    @inject('ArticleRepository') private articleRepository: ArticleRepository,
    @inject('AuthRepository') private authRepository: AuthRepository,
    @inject(CommonTypes.linkPreview)
    private linkPreviewProvider: LinkPreviewProvider,
    @inject(FamilyMemberTypes.familyMember)private familyMemberService: FamilyMemberService,
    @inject('ActivityRepository') private activityRepository: ActivityRepository,
    @inject('RelationshipRepository') private relationshipRepository: RelationshipRepository,
    @inject(TaskTypes.task) private taskService: TaskService,
  ) {}

  async getArticles(details: ArticlePaginationModel) {
    return await this.articleRepository.getArticles(details)
  }

  async getArticlesToSuggest(userId:string){
    const unfilteredArticles = await this.articleRepository.getAllArticles()
    const articles = [];
    const articleIdSet = new Set<string>();
    const taskActivityIdSet = await this.taskService.getTasksInNextFourteenDays(userId);
    this.getArticlesFromActivityIds(articles,articleIdSet,unfilteredArticles,taskActivityIdSet);

    return articles
  }

  async addArticle(url,activityIds) {
    const newArticle:ArticleModel = await this.linkPreviewProvider.getPreview(url)

    if (!newArticle.title || !newArticle.imageUrl) {
      throw new ArgumentValidationError(
        'linkPreview Data',
        newArticle,
        ApiErrorCode.E0027,
      )
    }

    newArticle.activityIds = activityIds;

    const article = await this.articleRepository.addArticle(newArticle)
    return article
  }

  async getBookmarks(userId) {
    const articles = await this.articleRepository.getArticlesBookmarkedByUser(
      userId,
    )

    return articles
  }

  async addBookmark(userId, articleId) {
    const bookmark: ArticleBookmarkModel = {
      userId: userId,
      articleId: articleId,
      isDeleted: false,
    }

    const result = await this.articleRepository.upsertBookmark(bookmark)
    return result
  }

  async removeBookmark(userId, articleId) {
    const bookmark: ArticleBookmarkModel = {
      userId: userId,
      articleId: articleId,
      isDeleted: true,
    }

    const result = await this.articleRepository.removeBookmark(bookmark)
    return result
  }

  private async getArticlesFromActivityIds(articles,articleIdSet,unfilteredArticles,activityIds){
    for(const article of unfilteredArticles){
      for(const activityId of activityIds){
        if(article.activityIds?.includes(activityId) && !articleIdSet.has(article.id)){
          articles.push(article);
          articleIdSet.add(article.id);
          break;
        }
      }
    }
  }
}
