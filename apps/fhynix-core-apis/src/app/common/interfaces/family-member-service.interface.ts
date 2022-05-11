import { FamilyMemberModel } from '../models/family-members-model'

export interface FamilyMemberServiceInterface {
  createFamilyMember(
    familyDetails: FamilyMemberModel,
  ): Promise<FamilyMemberModel>
}
