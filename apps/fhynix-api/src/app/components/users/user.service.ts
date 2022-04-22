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
}
