import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { SuggestionServiceInterface } from '../../common/interfaces/suggestion-service.interface'
import { ArticleRepository } from '../suggestions/article.repository'
import { ArticleModel } from '../../common/models/article.model'
import { PaginationModel } from '../../common/models/pagination.model'
import { AuthRepository } from '../accounts/auth.repository'
import { CommonTypes } from '../../common/common.types'
import { LinkPreviewProvider } from '../../common/linkPreviewProvider/linkPreview.provider'
import { ArgumentValidationError } from '../../common/errors/custom-errors/argument-validation.error'
import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { ArticleBookmarkModel } from '../../common/models/articleBookmark.model'
import { FamilyMemberService } from '../family-member/family-member.service'
import { FamilyMemberTypes } from '../family-member/family-member.types'
import { RelationshipRepository } from '../relationship/relationship.repository'
import { ActivityRepository } from '../activity/activity.repository'
import {TaskTypes} from '../task/task.types'
import {TaskService} from '../task/task.service'
import { ProductModel } from '../../common/models/product.model'
import { ProductRepository } from './product.repository'
import { SuggestionTypeEnum } from '../../common/enums/suggestion-type.enum'
import { VendorRepository } from './vendor.repository'
import { RestaurantRepository } from './restaurant.repository'
import { MovieRepository } from './movie.repository'
import { SuggestionResponseModel } from '../../common/models/suggestion-response.model'

@injectable()
export class SuggestionService implements SuggestionServiceInterface {
  constructor(
    @inject('ArticleRepository') private articleRepository: ArticleRepository,
    @inject('AuthRepository') private authRepository: AuthRepository,
    @inject(CommonTypes.linkPreview)
    private linkPreviewProvider: LinkPreviewProvider,
    @inject(FamilyMemberTypes.familyMember)private familyMemberService: FamilyMemberService,
    @inject('ActivityRepository') private activityRepository: ActivityRepository,
    @inject('RelationshipRepository') private relationshipRepository: RelationshipRepository,
    @inject(TaskTypes.task) private taskService: TaskService,
    @inject('ProductRepository') private productRepository: ProductRepository,
    @inject('VendorRepository') private vendorRepository: VendorRepository,
    @inject('RestaurantRepository') private restaurantRepository: RestaurantRepository,
    @inject('MovieRepository') private movieRepository: MovieRepository,
  ) {}

  async getArticles(details: PaginationModel) {
    return await this.articleRepository.getArticles(details)
  }

  async getArticlesToSuggest(userId:string){
    const mostRecent50Articles = await this.articleRepository.getMostRecent50Articles()
    const articles = [];
    const articleIdSet = new Set<string>();
    const taskActivityIdSet = await this.taskService.getTasksInNextFourteenDays(userId);
    this.getArticlesFromActivityIds(articles,articleIdSet,mostRecent50Articles,taskActivityIdSet);

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

  async addProduct(url,price,activityIds) {
    const newProduct:ProductModel = await this.linkPreviewProvider.getPreview(url);

    if(!newProduct.title || !newProduct.imageUrl){
      throw new ArgumentValidationError(
        'linkPreview Data',
        newProduct,
        ApiErrorCode.E0015
      )
    }

    newProduct.activityIds = activityIds
    newProduct.price = price

    const Product = await this.productRepository.addProduct(newProduct);
    return Product;
  }

  async getSuggestionsForActivity(id:string): Promise<SuggestionResponseModel>{
    const activityDetails = await this.activityRepository.getActivityByActivityId(id);

    const suggestions = activityDetails?.associatedSuggestionTypes;
    const paginationDetails:PaginationModel = {
      pageNumber:1,
      pageSize:50
    }
    const response:SuggestionResponseModel = {
      articles:[],
      products:[],
      vendors:[],
      restaurants:[],
      movies:[]
    };

    //articles
    if(suggestions.includes(SuggestionTypeEnum.Articles)){
      while(response.articles.length<3){
        const articles = await this.articleRepository.getArticles(paginationDetails);
        if(articles.length==0)break;
        this.filterSuggestions(response.articles,articles,id);
        paginationDetails.pageNumber++;
      }
    }
    paginationDetails.pageNumber = 1;

    //products
    if(suggestions.includes(SuggestionTypeEnum.Products)){
      while(response.products.length<3){
        const products = await this.productRepository.getProducts(paginationDetails);
        if(products.length==0)break;
        this.filterSuggestions(response.products,products,id);
        paginationDetails.pageNumber++;
      }
    }
    paginationDetails.pageNumber = 1;

    //vendors
    if(suggestions.includes(SuggestionTypeEnum.Vendors)){
      while(response.vendors.length<3){
        const vendors = await this.vendorRepository.getVendors(paginationDetails);
        if(vendors.length==0)break;
        this.filterSuggestions(response.vendors,vendors,id);
        paginationDetails.pageNumber++;
      }
    }
    paginationDetails.pageNumber = 1;

    // restaurants
    if(suggestions.includes(SuggestionTypeEnum.Restaurants)){
      while(response.restaurants.length<3){
        const restaurants = await this.restaurantRepository.getRestaurants(paginationDetails);
        if(restaurants.length==0)break;
        this.filterSuggestions(response.restaurants,restaurants,id);
        paginationDetails.pageNumber++;
      }
    }
    paginationDetails.pageNumber = 1;

    // movies
    if(suggestions.includes(SuggestionTypeEnum.Movies)){
      while(response.movies.length<3){
        const movies = await this.movieRepository.getMovies(paginationDetails);
        if(movies.length==0)break;
        this.filterSuggestions(response.movies,movies,id);
        paginationDetails.pageNumber++;
      }
    }
    return response;
  }

  private async filterSuggestions(filteredSuggestions,unfilteredSuggestions,activityId){
    for(const suggestion of unfilteredSuggestions){
      if(suggestion?.activityIds?.includes(activityId)){
        filteredSuggestions.push(suggestion);
        if(filteredSuggestions.length==3)return;
      }
    }
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
