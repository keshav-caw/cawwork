import { FamilyMemberModel } from '../models/family-members-model'

export interface FamilyMemberRepositoryInterface {
  createFamilyMember(
    familyDetails: FamilyMemberModel,
  ): Promise<FamilyMemberModel>
}
