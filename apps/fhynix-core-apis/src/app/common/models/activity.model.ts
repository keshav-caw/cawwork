import { ActivityTypeEnum } from "../enums/activity-type.enum"
import { SuggestionTypeEnum } from "../enums/suggestion-type.enum"

export class ActivityMasterModel {
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