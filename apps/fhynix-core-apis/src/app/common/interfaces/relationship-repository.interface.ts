import { RelationshipsMaster } from '@prisma/client'

export interface RelationshipRepositoryInterface {
  getRelationshipsMaster(): Promise<RelationshipsMaster[]>
  getRelationshipsMasterByRelation(relation: string)
}
