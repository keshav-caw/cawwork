import { RelationshipsMaster } from '@prisma/client'

export interface RelationshipRepositoryInterface {
  getRelationshipsMaster(userId: string): Promise<RelationshipsMaster[]>
}
