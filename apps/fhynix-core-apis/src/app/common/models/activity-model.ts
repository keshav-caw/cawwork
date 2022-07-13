import { ActivityTypeEnum } from "../enums/activity-type.enum"

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
}
