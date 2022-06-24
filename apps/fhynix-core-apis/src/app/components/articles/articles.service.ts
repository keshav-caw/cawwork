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

  async getArticlesFromActivityIds(articles,articleIdSet,unfilteredArticles,activityIds){
    for(const article of unfilteredArticles){
      for(const activityId of activityIds){
        if(article.activityIds?.includes(activityId) && articleIdSet.has(article.id)==false){
          articles.push(article);
          articleIdSet.add(article.id);
          break;
        }
      }
    }
  }

  async getArticlesToSuggest(userId:string){
    const unfilteredArticles = await this.articleRepository.getArticlesToSuggest()
    const articles = [];
    const articleIdSet = new Set<string>();

    const familyMembers = await this.familyMemberService.getFamilyMembers(userId);
    const relations = await this.relationshipRepository.getRelationshipsMasterByRelation('self');
    const selfRelationshipId = relations[0].id;


    // Here we are getting activityIds related to user-self
    const selfActivityIdSet = new Set<string>();
    for(const familyMember of familyMembers){
      if(familyMember.relationshipId===selfRelationshipId){
        for(const familyMemberActivity of familyMember['activities']){
          selfActivityIdSet.add(familyMemberActivity.activityId);
        }
      }
    }
    this.getArticlesFromActivityIds(articles,articleIdSet,unfilteredArticles,selfActivityIdSet);


    // and here collecting activityIds for family-members of that user
    // note that we are not collecting activityIds for both user-self and his family-Members because we has already collected them in selfActivityIds
    const familyMemberActivityIdSet = new Set<string>();
    for(const familyMember of familyMembers){
      if(familyMember.relationshipId!==selfRelationshipId){
        for(const familyMemberActivity of familyMember['activities']){
          if(selfActivityIdSet.has(familyMemberActivity.activityId)===false){
            familyMemberActivityIdSet.add(familyMemberActivity.activityId);
          }
        }
      }
    }
    this.getArticlesFromActivityIds(articles,articleIdSet,unfilteredArticles,familyMemberActivityIdSet);


    // getting articles relevant to incoming next 7 days tasks
    const startDate = new Date();
    const startDateInUtc = startDate.toISOString();
    const endDate = new Date(startDate.setDate(startDate.getDate() + 7));
    const endDateInUtc = endDate.toISOString();
    const taskActivityIdSet = new Set<string>();
    const tasks = await this.taskService.getTasksByStartAndEndDate(userId,startDateInUtc,endDateInUtc)
    for(const task of tasks){
      if(task.activityId){
        taskActivityIdSet.add(task.activityId);
      }
    }
    this.getArticlesFromActivityIds(articles,articleIdSet,unfilteredArticles,taskActivityIdSet);

    return articles
  }

  async addArticle(url,activityIds) {
    const newArticle = await this.linkPreviewProvider.getPreview(url)

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
}
