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
}
