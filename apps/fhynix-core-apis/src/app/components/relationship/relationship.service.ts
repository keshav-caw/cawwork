import { RelationshipsMaster } from '@prisma/client'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { RelationshipServiceInterface } from '../../common/interfaces/realtionship-service.interface'
import { RelationshipRepository } from '../relationship/relationship.repository'

@injectable()
export class RelationshipService implements RelationshipServiceInterface {
  constructor(
    @inject('RelationshipRepository')
    private relationshipRepository: RelationshipRepository,
  ) {}

  async getRelationships(): Promise<RelationshipsMaster[]> {
    return await this.relationshipRepository.getRelationshipsMaster()
  }
}
