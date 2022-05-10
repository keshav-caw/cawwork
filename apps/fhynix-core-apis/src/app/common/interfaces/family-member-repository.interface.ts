import { FamilyMemberModel } from '../models/family-members-model'

export interface FamilyMemberRepositoryInterface {
  createFamilyMember(
    familyDetails: FamilyMemberModel,
  ): Promise<FamilyMemberModel>
  getFamilyMembersForUser(
    userDetails: FamilyMemberModel,
  ): Promise<FamilyMemberModel[]>
  getFamilyMembers(userId: string): Promise<FamilyMemberModel[]>
  updateFamilyMembers(
    familyMembers: FamilyMemberModel,
    familyMemberId: string,
  ): Promise<FamilyMemberModel>
}
