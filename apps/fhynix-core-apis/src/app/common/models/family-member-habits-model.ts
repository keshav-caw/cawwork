export class FamilyMemberActivityModel {
  id: string
  createdAtUtc?: Date
  createdBy?: string
  updatedAtUtc?: Date
  updatedBy?: string
  isDeleted?: boolean
  familyMemberId: string
  activityId: string
  name: string
  appliesForRelation: string
}
