import { RelationshipsMaster } from '@prisma/client'
import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../common/data/datastore'
import { UserRepositoryInterface } from '../../common/interfaces/user-repository.interface'
import { FamilyMemberModel } from '../../common/models/family-members-model'
import { UserModel } from '../../common/models/user-model'

@injectable()
export class UserRepository implements UserRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getUserDetails(userId: string): Promise<UserModel[]> {
    const result = await this.client.users?.findMany({
      select: {
        id: true,
        phone: true,
        email: true,
        accountId: true,
        isOnboardingCompleted: true,
      },
      where: {
        id: userId,
      },
    })
    return result ? result : []
  }

  async getUserDetailsByAccountId(accountId: string): Promise<UserModel[]> {
    const result = await this.client.users?.findMany({
      select: {
        id: true,
        phone: true,
        email: true,
        accountId: true,
        isOnboardingCompleted: true,
      },
      where: {
        accountId: accountId,
      },
    })
    return result ? result : []
  }

  async getRelationshipsMaster(
    relation: string,
  ): Promise<RelationshipsMaster[]> {
    const result = await this.client.relationshipsMaster?.findMany({
      select: {
        id: true,
        relation: true,
        relationType: true,
      },
      where: {
        relation: relation,
      },
    })
    return result ? result : []
  }

  async createUser(userDetails: UserModel): Promise<UserModel> {
    const result = await this.client.users?.create({
      data: userDetails,
    })
    return result
  }

  async createFamilyMembers(
    familyDetails: FamilyMemberModel,
  ): Promise<FamilyMemberModel> {
    const result = await this.client.familyMembers?.create({
      data: familyDetails,
    })
    return result
  }

  async updateUserDetails(
    userDetails: UserModel,
    userId: string,
  ): Promise<UserModel> {
    const result = await this.client.users?.update({
      data: userDetails,
      where: {
        id: userId,
      },
    })
    return result
  }
}
