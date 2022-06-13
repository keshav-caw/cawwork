import { RelationshipsMaster } from '@prisma/client'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { RelationshipServiceInterface } from '../../common/interfaces/realtionship-service.interface'
import { RelationshipRepository } from '../relationship/relationship.repository'
import * as _ from 'lodash'

@injectable()
export class RelationshipService implements RelationshipServiceInterface {
  constructor(
    @inject('RelationshipRepository')
    private relationshipRepository: RelationshipRepository,
  ) {}

  async getRelationships(): Promise<RelationshipsMaster[]> {
    let relationships =
      await this.relationshipRepository.getRelationshipsMaster()
    relationships = _.sortBy(relationships, 'priority')
    return relationships
  }
}
