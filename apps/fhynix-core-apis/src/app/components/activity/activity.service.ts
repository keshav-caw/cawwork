import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { ArgumentValidationError } from '../../common/errors/custom-errors/argument-validation.error'
import { ActivityServiceInterface } from '../../common/interfaces/activity-service.interface'
import { FamilyMemberActivityModel } from '../../common/models/family-member-activity-model'
import { ActivitiesMasterModel } from '../../common/models/activity-model'
import { ActivityRepository } from './activity.repository'
import { ActivitiesScheduleMasterModel } from '../../common/models/activities-schedule-master.model'
import { SuggestionTypeEnum } from '../../common/enums/suggestion-type.enum'
import { PaginationModel } from '../../common/models/pagination.model'
import { ArticleRepository } from '../articles/article.repository'
import { ProductRepository } from '../products/product.repository'
import {SuggestionResponsePayload} from '../../../../../shared/payloads/suggestion-response.payload'

@injectable()
export class ActivityService implements ActivityServiceInterface {
  taskService
  constructor(
    @inject('ActivityRepository')
    private activityRepository: ActivityRepository,
    @inject('ArticleRepository') private articleRepository: ArticleRepository,
    @inject('ProductRepository') private productRepository: ProductRepository,
  ) {}

  async getActivityByRelationship(
    relationship: string,
  ): Promise<ActivitiesMasterModel[]> {
    return await this.activityRepository.getActivityByRelationship(relationship)
  }

  async getAllActivities(): Promise<ActivitiesMasterModel[]> {
    return await this.activityRepository.getAllActivities()
  }

  async getActivityByRelationshipAndName(
    relationship: string,
    name: string,
  ): Promise<ActivitiesMasterModel[]> {
    return await this.activityRepository.getActivityByRelationshipAndName(
      relationship,
      name,
    )
  }

  async getActivityScheduleByByRelationshipAndName(
    relationship: string,
  ): Promise<ActivitiesScheduleMasterModel[]> {
    return await this.activityRepository.getActivityScheduleByByRelationshipAndName(
      relationship,
    )
  }

  async getActivityByFamilyMemberId(
    relationship: string,
  ): Promise<ActivitiesMasterModel[]> {
    return await this.activityRepository.getActivityByFamilyMemberId(
      relationship,
    )
  }

  async createActivitiesForRelationship(
    relationshipActivities: FamilyMemberActivityModel[],
    userId: string,
  ): Promise<FamilyMemberActivityModel[]> {
    relationshipActivities = relationshipActivities.filter(
      (activity) => activity?.name?.trim().length !== 0,
    )
    if (relationshipActivities?.length < 2) {
      throw new ArgumentValidationError(
        'Atleast 2 activities must be added',
        relationshipActivities,
        ApiErrorCode.E0021,
      )
    }

    let familyMemberIds = relationshipActivities.map(
      (relationshipActivity) => relationshipActivity.familyMemberId,
    )
    familyMemberIds = [...new Set(familyMemberIds)]
    const familyMemberCalls = []

    familyMemberIds.forEach((familyMemberId) => {
      familyMemberCalls.push(
        this.activityRepository.deleteRelationshipActivities(familyMemberId),
      )
    })

    await Promise.all(familyMemberCalls)
    const calls = []
    relationshipActivities.forEach((relationshipActivity) => {
      calls.push(this.createRelationshipActivity(relationshipActivity, userId))
    })

    const response = await Promise.all(calls)

    return response
  }

  async createRelationshipActivity(
    relationshipActivity: FamilyMemberActivityModel,
    userId: string,
  ) {
    let createdCustomActivity
    if (!relationshipActivity.activityId) {
      const customActivity = {
        name: relationshipActivity.name,
        appliesForRelation: relationshipActivity.appliesForRelation,
        canBeHabit: true,
        isCustom: true,
      }
      createdCustomActivity = await this.activityRepository.createActivity(
        customActivity,
      )
      relationshipActivity.activityId = createdCustomActivity?.id
    }
    const selectedRelationshipActivity = JSON.parse(
      JSON.stringify(relationshipActivity),
    )
    delete relationshipActivity['name']
    delete relationshipActivity['appliesForRelation']
    const relationshipActivityCreated =
      await this.activityRepository.createRelationshipActivity(
        relationshipActivity,
      )
    relationshipActivityCreated['name'] = selectedRelationshipActivity['name']
    relationshipActivityCreated['appliesForRelation'] =
      selectedRelationshipActivity['appliesForRelation']
    return relationshipActivityCreated
  }

  async filterSuggestions(filteredSuggestions,unfilteredSuggestions,activityId){
    for(const suggestion of unfilteredSuggestions){
      if(suggestion?.activityIds?.includes(activityId)){
        filteredSuggestions.push(suggestion);
        if(filteredSuggestions.length==3)return;
      }
    }
  }

  async getSuggestionsForActivity(id:string): Promise<SuggestionResponsePayload>{
    const activityDetails = await this.activityRepository.getActivityByActivityId(id);
    const suggestions = activityDetails.associatedSuggestionTypes;
    const paginationDetails:PaginationModel = {
      pageNumber:1,
      pageSize:50
    }
    const response = {
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
        const vendors = await this.activityRepository.getVendors(paginationDetails);
        if(vendors.length==0)break;
        this.filterSuggestions(response.vendors,vendors,id);
        paginationDetails.pageNumber++;
      }
    }
    paginationDetails.pageNumber = 1;

    // restaurants
    if(suggestions.includes(SuggestionTypeEnum.Restaurants)){
      while(response.restaurants.length<3){
        const restaurants = await this.activityRepository.getRestaurants(paginationDetails);
        if(restaurants.length==0)break;
        this.filterSuggestions(response.restaurants,restaurants,id);
        paginationDetails.pageNumber++;
      }
    }
    paginationDetails.pageNumber = 1;

    // movies
    if(suggestions.includes(SuggestionTypeEnum.Movies)){
      while(response.movies.length<3){
        const movies = await this.activityRepository.getMovies(paginationDetails);
        if(movies.length==0)break;
        this.filterSuggestions(response.movies,movies,id);
        paginationDetails.pageNumber++;
      }
    }

    const responsePayload: SuggestionResponsePayload = new SuggestionResponsePayload(response.articles,response.products,response.vendors,response.restaurants,response.movies);
    return responsePayload;
  }
}
