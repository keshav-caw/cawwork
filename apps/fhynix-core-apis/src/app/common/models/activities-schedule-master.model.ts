export class ActivitiesScheduleMasterModel {
  id?: string
  createdAtUtc?: Date
  createdBy?: string
  updatedAtUtc?: Date
  updatedBy?: string
  isDeleted?: boolean
  name: string
  appliesForRelation: string
  timings?: string[]
  days?: string[]
  timeSlotInMinutes?: number
  numberOfTimesPerWeek?: number
}
