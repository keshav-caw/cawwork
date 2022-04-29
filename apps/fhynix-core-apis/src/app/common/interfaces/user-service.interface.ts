import { FamilyMembersModel } from '../models/family-members-model'
import { UserModel } from '../models/user-model'

export interface UserServiceInterface {
  getUsers(userId: string)
  getUserByAccountId(acoountId: string)
  createUser(userDetails: UserModel)
  createFamilyMembers(familyDetails: FamilyMembersModel)
  updateUserDetails(userDetails: UserModel, userId: string)
}
