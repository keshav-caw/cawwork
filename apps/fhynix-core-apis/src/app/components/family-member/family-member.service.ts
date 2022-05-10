import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { FamilyMemberServiceInterface } from '../../common/interfaces/family-member-service.interface'
import { FamilyMemberModel } from '../../common/models/family-members-model'
import { FamilyMemberRepository } from './family-members.repository'

@injectable()
export class FamilyMemberService implements FamilyMemberServiceInterface {
  constructor(
    @inject('FamilyMemberRepository')
    private familyMemberRepository: FamilyMemberRepository,
  ) {}

  async getFamilyMembersForUser(
    familyMemberDetails: FamilyMemberModel,
  ): Promise<FamilyMemberModel[]> {
    return await this.familyMemberRepository.getFamilyMembersForUser(
      familyMemberDetails,
    )
  }

  async updateFamilyMembers(
    familyDetails: FamilyMemberModel,
    familyMemberId: string,
  ): Promise<FamilyMemberModel> {
    return await this.familyMemberRepository.updateFamilyMembers(
      familyDetails,
      familyMemberId,
    )
  }

  async createFamilyMember(
    familyDetails: FamilyMemberModel,
  ): Promise<FamilyMemberModel> {
    return await this.familyMemberRepository.createFamilyMember(familyDetails)
  }
}
