import { FamilyMembersModel } from '../models/family-members-model'
import { UserModel } from '../models/user-model'

export interface UserRepositoryInterface {
  getUserDetails(userId: string)
  getUserDetailsByAccountId(accountId: string)
  createUser(userDetails: UserModel)
  createFamilyMembers(familyDetails: FamilyMembersModel)
  updateUserDetails(userDetails: UserModel, userId: string)
}
