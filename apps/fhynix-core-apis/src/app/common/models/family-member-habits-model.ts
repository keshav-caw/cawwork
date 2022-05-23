export class FamilyMemberHabitsModel {
  id: string
  createdAtUtc?: Date
  createdBy?: string
  updatedAtUtc?: Date
  updatedBy?: string
  isDeleted?: boolean
  familyMemberId: string
  habitId: string
  name: string
  appliesForRelation: string
}
