import { RelationshipsMaster } from '@prisma/client'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../common/data/datastore'
import { RelationshipRepositoryInterface } from '../../common/interfaces/relationship-repository.interface'

@injectable()
export class RelationshipRepository implements RelationshipRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getRelationshipsMaster(): Promise<RelationshipsMaster[]> {
    const result = await this.client.relationshipsMaster?.findMany({
      select: {
        id: true,
        relation: true,
        relationType: true,
      },
    })
    return result ? result : []
  }

  async getRelationshipsMasterByRelation(
    relation: string,
  ): Promise<RelationshipsMaster[]> {
    const result = await this.client.relationshipsMaster?.findMany({
      select: {
        id: true,
        relation: true,
        relationType: true,
      },
      where: {
        relation: relation,
        isDeleted: false,
      },
    })
    return result ? result : []
  }
}
