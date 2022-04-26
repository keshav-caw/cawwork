export interface UserServiceInterface {
  getUsers(userId: number)
  getUserByEmailId(userEmail: string)
  createUser(userDetails: any)
  createFamilyMembers(familyDetails: any)
  updateUserDetails(userDetails: any, userId: number)
}
