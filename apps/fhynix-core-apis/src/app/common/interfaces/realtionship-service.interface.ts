import { RelationshipsMaster } from '@prisma/client'

export interface RelationshipServiceInterface {
  getRelationships(): Promise<RelationshipsMaster[]>
}
