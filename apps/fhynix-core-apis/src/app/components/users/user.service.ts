import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { UserRepository } from './user.repository'

@injectable()
export class UserService {
  constructor(
    @inject('UserRepository') private userRepository: UserRepository,
  ) {}
  async getUsers(userId) {
    const details = await this.userRepository.getUserDetails(userId)
    return details
  }

  async getUserByEmailId(userEmail) {
    const details = await this.userRepository.getUserDetailsByEmailId(userEmail)
    return details
  }

  async createUser(userDetails) {
    return await this.userRepository.createUser(userDetails)
  }

  async createFamilyMembers(userDetails) {
    return await this.userRepository.createFamilyMembers(userDetails)
  }

  async updateUserDetails(userDetails, userId) {
    return await this.userRepository.updateUserDetails(userDetails, userId)
  }
}
