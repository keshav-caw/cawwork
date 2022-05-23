import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { RelationshipServiceInterface } from '../../common/interfaces/realtionship-service.interface'
import { RelationshipTypes } from './realtionship.types'
import { RelationshipController } from './relationship.controller'
import { RelationshipRepository } from './relationship.repository'
import { RelationshipService } from './relationship.service'

@injectable()
export default class RelationshipBootstrapper {
  public static initialize() {
    CommonContainer.bind<RelationshipRepository>('RelationshipRepository').to(
      RelationshipRepository,
    )
    CommonContainer.bind<RelationshipServiceInterface>(
      RelationshipTypes.relationship,
    ).to(RelationshipService)
    CommonContainer.bind<RelationshipController>('RelationshipController').to(
      RelationshipController,
    )
  }
}
