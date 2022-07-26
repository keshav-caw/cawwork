import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { SuggestionServiceInterface } from '../../../common/interfaces/suggestion-service.interface'
import { ArticleRepository } from '../repositories/article.repository'
import { PaginationModel } from '../../../common/models/pagination.model'
import { ActivityRepository } from '../../activity/activity.repository'
import { ProductRepository } from '../repositories/product.repository'
import { SuggestionTypeEnum } from '../../../common/enums/suggestion-type.enum'
import { VendorRepository } from '../repositories/vendor.repository'
import { RestaurantRepository } from '../repositories/restaurant.repository'
import { MovieRepository } from '../repositories/movie.repository'
import { SuggestionResponseModel } from '../../../common/models/suggestion-response.model'
import { TimespanHelper } from '../../utilities/timespan.helper'
import { UtilityTypes } from '../../utilities/utility.types'
import { TaskRepository } from '../../task/task.repository'
import { TaskModel } from '../../../common/models/task.model'

@injectable()
export class SuggestionService implements SuggestionServiceInterface {
  constructor(
    @inject('ArticleRepository') private articleRepository: ArticleRepository,
    @inject('ActivityRepository') private activityRepository: ActivityRepository,
    @inject('ProductRepository') private productRepository: ProductRepository,
    @inject('VendorRepository') private vendorRepository: VendorRepository,
    @inject('RestaurantRepository') private restaurantRepository: RestaurantRepository,
    @inject('MovieRepository') private movieRepository: MovieRepository,
    @inject(UtilityTypes.timespanHelper) private timespanHelper: TimespanHelper,
    @inject('TaskRepository') private taskRepository: TaskRepository,
  ) {}

  async getSuggestions(userId:string): Promise<TaskModel[]>{
    const interval = this.timespanHelper.nextFourteenDays
    const tasks = await this.taskRepository.getTasksForSuggestions(
      userId,
      interval.startDateInUtc,
      interval.endDateInUtc,
    )
    

    const taskActivity = new Map();
    for(const task of tasks){
      if(task.activityId && !taskActivity.has(task.activityId)){
        taskActivity.set(task.activityId,task);
      }
    }

    const calls = [];
    for (const activityId of taskActivity.keys()) {
      calls.push(this.getSuggestionsForActivity(activityId));
    }

    const suggestionsArray:SuggestionResponseModel[] = await Promise.all(calls)
    const response: TaskModel[] = [];

    taskActivity.forEach((task,_)=>{
      task.suggestions = suggestionsArray[response.length]
      response.push(task)
    })

    return response;
  }

  async getSuggestionsForActivity(id:string): Promise<SuggestionResponseModel>{
    const activityDetails = await this.activityRepository.getActivityByActivityId(id);

    const suggestions = activityDetails?.associatedSuggestionTypes;
    const paginationDetails:PaginationModel = {
      pageNumber:1,
      pageSize:3
    }
    const response:SuggestionResponseModel = {
      articles:[],
      products:[],
      vendors:[],
      restaurants:[],
      movies:[]
    };

    if(suggestions?.includes(SuggestionTypeEnum.Articles)){
        response.articles = await this.articleRepository?.getArticlesAssociatedToActivityId(paginationDetails,id);
    }

    if(suggestions?.includes(SuggestionTypeEnum.Products)){
        response.products = await this.productRepository?.getProductsAssociatedToActivityId(paginationDetails,id);
    }

    if(suggestions?.includes(SuggestionTypeEnum.Vendors)){
        response.vendors = await this.vendorRepository?.getVendorsAssociatedToActivityId(paginationDetails,id);
    }

    if(suggestions?.includes(SuggestionTypeEnum.Restaurants)){
        response.restaurants = await this.restaurantRepository?.getRestaurantsAssociatedToActivityId(paginationDetails,id);
    }

    if(suggestions?.includes(SuggestionTypeEnum.Movies)){
        response.movies = await this.movieRepository.getMoviesAssociatedToActivityId(paginationDetails,id);
    }
    return response;
  }
 
}
