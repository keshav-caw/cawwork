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

  async getUserByEmailId(userEmail: string) {
    const details = await this.userRepository.getUserDetailsByEmailId(userEmail)
    return details
  }

  async createUser(userDetails: UserModel) {
    return await this.userRepository.createUser(userDetails)
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
