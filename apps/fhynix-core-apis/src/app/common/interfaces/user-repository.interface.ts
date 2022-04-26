export interface UserRepositoryInterface {
  getUserDetails(userId: number)
  getUserDetailsByEmailId(userEmail: string)
  createUser(userDetails: any)
  createFamilyMembers(familyDetails: any)
  updateUserDetails(userDetails: any, userId: number)
}
