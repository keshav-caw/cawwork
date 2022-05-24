import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../common/data/datastore'
import { AuthRepositoryInterface } from '../../common/interfaces/auth-repository.interface'
import { AccountModel } from '../../common/models/account-model'

@injectable()
export class AuthRepository implements AuthRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getAccountDetails(username: string): Promise<AccountModel[]> {
    const result = await this.client.accounts?.findMany({
      select: {
        id: true,
        username: true,
      },
      where: {
        username: username,
        isDeleted: false,
      },
    })
    return result ? result : []
  }

  async createAccounts(accountDetails: AccountModel): Promise<AccountModel> {
    accountDetails['lastLoginAtUtc'] = new Date()
    const result = await this.client.accounts?.create({
      data: accountDetails,
    })
    
    
    return result
  }

  async updateAccounts(
    accountDetails: AccountModel,
    accountId: string,
  ): Promise<AccountModel> {
    accountDetails['lastLoginAtUtc'] = new Date()
    const result = await this.client.accounts?.update({
      data: accountDetails,
      where: {
        id: accountId,
      },
    })
    return result
  }
}
