import { ActivityTypeEnum } from "../enums/activity-type.enum"
import { SuggestionTypeEnum } from "../enums/suggestion-type.enum"

export class ActivitiesMasterModel {
  id?: string
  createdAtUtc?: Date
  createdBy?: string
  updatedAtUtc?: Date
  updatedBy?: string
  isDeleted?: boolean
  name: string
  appliesForRelation: string
  canBeHabit?: boolean
  isCustom?: boolean
  category?:string
  type?:ActivityTypeEnum
  associatedSuggestionTypes?: SuggestionTypeEnum[]
}

export class VendorModel {
  id:string
  name:string
  address?: string 
  phoneNumbers:string[] 
  activityIds:string[]
}

export class RestaurantModel {
  id:string
  name:string
  address: string 
  phoneNumbers:string[] 
  activityIds?:string[]
  imageUrl: string
}

export class MovieModel {
  id:string
  title:string
  description?: string 
  activityIds:string[]
  imageUrl: string
  language?: string
  runningTime?: string
}
