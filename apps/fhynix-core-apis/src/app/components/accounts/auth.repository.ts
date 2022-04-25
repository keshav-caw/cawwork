import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../common/data/datastore'
import { AuthRepositoryInterface } from '../../common/interfaces/auth-repository.interface'

@injectable()
export class AuthRepository implements AuthRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getLoginDetails(userDetails: any) {
    const result = await this.client.users?.findMany({
      where: {
        emailId: userDetails.username,
        password: userDetails.password,
      },
    })
    return result
  }

  async createUser(userDetails) {
    const result = await this.client.users?.create({
      data: userDetails,
    })
    return result
  }
}
