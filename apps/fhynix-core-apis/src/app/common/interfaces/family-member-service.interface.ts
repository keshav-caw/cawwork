import { FamilyMemberModel } from '../models/family-members-model'

export interface FamilyMemberServiceInterface {
  createFamilyMember(
    familyDetails: FamilyMemberModel,
  ): Promise<FamilyMemberModel>
  getFamilyMembersByRelationshipId(
    familyMemberDetails: FamilyMemberModel,
  ): Promise<FamilyMemberModel[]>
  updateFamilyMembers(
    familyDetails: FamilyMemberModel,
    familyMemberId: string,
  ): Promise<FamilyMemberModel>
}
