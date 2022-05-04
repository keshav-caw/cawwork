import { RelationshipsMaster } from '@prisma/client'
import { FamilyMembersModel } from '../models/family-members-model'
import { UserModel } from '../models/user-model'

export interface RelationshipRepositoryInterface {
  getRelationshipsMaster(userId: string): Promise<RelationshipsMaster[]>
}
