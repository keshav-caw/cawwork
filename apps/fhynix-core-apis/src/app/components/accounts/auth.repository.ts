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

  async createAccounts(accountDetails: any) {
    accountDetails['last_login_at_utc'] = new Date().toISOString()
    const result = await this.client.accounts?.create({
      data: accountDetails,
    })
    return result
  }

  async updateAccounts(accountDetails: any, accountId: number) {
    accountDetails['last_login_at_utc'] = new Date().toISOString()
    const result = await this.client.accounts?.update({
      data: accountDetails,
      where: {
        id: Number(accountId),
      },
    })
    return result
  }
}
