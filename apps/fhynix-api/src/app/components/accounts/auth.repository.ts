import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../common/data/datastore'
import { AuthRepositoryInterface } from './auth-repository.interface'

@injectable()
export class AuthRepository implements AuthRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getLoginDetails(userDetails: any) {
    const result = await this.client.user?.findMany({
      where: {
        emailId: userDetails.username,
        password: userDetails.password,
      },
    })
    return result
  }

  async createUserDetails(userDetails) {
    const result = await this.client.user?.create({
      data: userDetails,
    })
    return result
  }
}
