import { RelationshipsMaster } from '@prisma/client'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { UserModel } from '../../common/models/user-model'
import { FamilyMemberService } from '../family-member/family-member.service'
import { FamilyMemberTypes } from '../family-member/family-member.types'
import { UserRepository } from './user.repository'

@injectable()
export class UserService {
  constructor(
    @inject('UserRepository') private userRepository: UserRepository,
    @inject(FamilyMemberTypes.familyMember)
    private familyMemberService: FamilyMemberService,
  ) {}
  async getUserDetail(userId: string): Promise<UserModel[]> {
    const details = await this.userRepository.getUserDetails(userId)
    return details
  }

  async getUserByAccountId(accountId: string): Promise<UserModel[]> {
    const details = await this.userRepository.getUserDetailsByAccountId(
      accountId,
    )
    return details
  }

  async createUser(userDetails: UserModel): Promise<UserModel> {
    const userData = await this.userRepository.createUser(userDetails)
    const relationship = await this.getRelationshipsMaster('Self')

    await this.familyMemberService.createFamilyMember({
      firstName: userDetails.email,
      relationshipId: relationship[0]?.id,
      userId: userData.id,
    })
    return userData
  }

  async updateUserDetails(
    userDetails: UserModel,
    userId: string,
  ): Promise<UserModel> {
    return await this.userRepository.updateUserDetails(userDetails, userId)
  }

  async getRelationshipsMaster(
    relation: string,
  ): Promise<RelationshipsMaster[]> {
    return await this.userRepository.getRelationshipsMaster(relation)
  }
}
