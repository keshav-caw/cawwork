import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { FamilyMembersModel } from '../../common/models/family-members-model'
import { UserModel } from '../../common/models/user-model'
import { UserRepository } from './user.repository'

@injectable()
export class UserService {
  constructor(
    @inject('UserRepository') private userRepository: UserRepository,
  ) {}
  async getUsers(userId: string) {
    const details = await this.userRepository.getUserDetails(userId)
    return details
  }

  async getUserByAccountId(accountId: string) {
    const details = await this.userRepository.getUserDetailsByAccountId(
      accountId,
    )
    return details
  }

  async createUser(userDetails: UserModel) {
    const userData = await this.userRepository.createUser(userDetails)
    const relationship = await this.getRelationshipsMaster('Self')

    await this.createFamilyMembers({
      firstName: userDetails.email,
      relationshipId: relationship[0]?.id,
      userId: userData.id,
    })
    return userData
  }

  async createFamilyMembers(familyDetails: FamilyMembersModel) {
    return await this.userRepository.createFamilyMembers(familyDetails)
  }

  async updateUserDetails(userDetails: UserModel, userId: string) {
    return await this.userRepository.updateUserDetails(userDetails, userId)
  }

  async getRelationshipsMaster(relation: string) {
    return await this.userRepository.getRelationshipsMaster(relation)
  }
}
