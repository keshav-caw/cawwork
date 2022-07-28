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

  async getSuggestions(userId:string,latitude:number,longitude:number): Promise<TaskModel[]>{
    const interval = this.timespanHelper.nextFourteenDays
    const details:PaginationModel = {
      pageNumber:1,
      pageSize:5
    }
    const tasks = await this.taskRepository.getTasksForSuggestions(
      userId,
      interval.startDateInUtc,
      interval.endDateInUtc,
      details
    )
    const taskActivity = new Map();
    for(const task of tasks){
      if(task.activityId && !taskActivity.has(task.activityId)){
        taskActivity.set(task.activityId,task);
      }
    }
    const calls = [];
    for (const activityId of taskActivity.keys()) {
      calls.push(this.getSuggestionsForActivity(activityId,latitude,longitude));
    }
    const suggestionsArray:SuggestionResponseModel[] = await Promise.all(calls)
    const response: TaskModel[] = [];
    taskActivity.forEach((task,_)=>{
      task.suggestions = suggestionsArray[response.length]
      response.push(task)
    })
    return response;
  }

  async getSuggestionsForActivity(id:string,latitude:number,longitude:number): Promise<SuggestionResponseModel>{
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
    const calls = [];

    if(suggestions?.includes(SuggestionTypeEnum.Articles)){
        calls.push(this.articleRepository?.getArticlesAssociatedToActivityId(id,paginationDetails));
    }else{
      calls.push([]);
    }

    if(suggestions?.includes(SuggestionTypeEnum.Products)){
        calls.push(this.productRepository?.getProductsAssociatedToActivityId(id,paginationDetails));
    }else{
      calls.push([]);
    }

    if(suggestions?.includes(SuggestionTypeEnum.Vendors)){
        calls.push(this.vendorRepository?.getVendorsAssociatedToActivityId(id,latitude,longitude,paginationDetails));
    }else{
      calls.push([]);
    }

    if(suggestions?.includes(SuggestionTypeEnum.Restaurants)){
        calls.push(this.restaurantRepository?.getRestaurantsAssociatedToActivityId(id,latitude,longitude,paginationDetails));
    }else{
      calls.push([]);
    }

    if(suggestions?.includes(SuggestionTypeEnum.Movies)){
        calls.push(this.movieRepository.getMoviesAssociatedToActivityId(id,paginationDetails));
    }else{
      calls.push([]);
    }

    const results = await Promise.all(calls);
    response.articles = results[0];
    response.products = results[1];
    response.vendors = results[2];
    response.restaurants = results[3];
    response.movies = results[4];
    return response;
  }
 
}
