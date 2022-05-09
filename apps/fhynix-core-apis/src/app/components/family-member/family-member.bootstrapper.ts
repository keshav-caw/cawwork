import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { FamilyMemberServiceInterface } from '../../common/interfaces/family-member-service.interface'
import { FamilyMemberService } from './family-member.service'
import { FamilyMemberTypes } from './family-member.types'
import { FamilyMemberRepository } from './family-members.repository'

@injectable()
export default class FamilyMemberBootstrapper {
  public static initialize() {
    CommonContainer.bind<FamilyMemberRepository>('FamilyMemberRepository').to(
      FamilyMemberRepository,
    )
    CommonContainer.bind<FamilyMemberServiceInterface>(
      FamilyMemberTypes.familyMember,
    ).to(FamilyMemberService)
  }
}
