export class RelationshipsMasterModel {
  id: string
  createdAtUtc?: Date
  createdBy?: string
  updatedAtUtc?: Date
  updatedBy?: string
  isDeleted?: boolean
  relation: string
  relationType: string
  isVisible: boolean
}
