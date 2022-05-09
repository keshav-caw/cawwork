import { FamilyMemberModel } from '../models/family-members-model'
import { UserModel } from '../models/user-model'

export interface UserServiceInterface {
  getUserDetail(userId: string): Promise<UserModel[]>
  getUserByAccountId(acoountId: string): Promise<UserModel[]>
  createUser(userDetails: UserModel): Promise<UserModel>
  createFamilyMembers(
    familyDetails: FamilyMemberModel,
  ): Promise<FamilyMemberModel>
  updateUserDetails(userDetails: UserModel, userId: string): Promise<UserModel>
}
