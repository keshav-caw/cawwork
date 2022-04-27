import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../common/data/datastore'
import { UserRepositoryInterface } from '../../common/interfaces/user-repository.interface'

@injectable()
export class UserRepository implements UserRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getUserDetails(userId: number) {
    const result = await this.client.users?.findMany({
      select: {
        id: true,
        phone: true,
        email: true,
      },
      where: {
        id: Number(userId),
      },
    })
    return result ? result : []
  }

  async getUserDetailsByEmailId(userEmail: string) {
    const result = await this.client.users?.findMany({
      select: {
        id: true,
        phone: true,
        email: true,
        account_id: true,
      },
      where: {
        email: userEmail,
      },
    })
    return result ? result : []
  }

  async createUser(userDetails) {
    const result = await this.client.users?.create({
      data: userDetails,
    })
    return result
  }

  async createFamilyMembers(familyDetails) {
    const result = await this.client.familyMembers?.create({
      data: familyDetails,
    })
    return result
  }

  async updateUserDetails(userDetails: any, userId: number) {
    const result = await this.client.users?.update({
      data: userDetails,
      where: {
        id: Number(userId),
      },
    })
    return result
  }
}
