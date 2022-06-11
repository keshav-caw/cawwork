import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { CommonTypes } from '../../common/common.types'
import { CommonContainer } from '../../common/container'
import { DataStore } from '../../common/data/datastore'
import UnauthorizedError from '../../common/errors/custom-errors/unauthorized.error'
import { AuthRepositoryInterface } from '../../common/interfaces/auth-repository.interface'
import { RequestContext } from '../../common/jwtservice/requests-context.service'
import { AccountModel } from '../../common/models/account-model'

@injectable()
export class AuthRepository implements AuthRepositoryInterface {
  protected client;
  private readonly requestContext = CommonContainer.get<RequestContext>(CommonTypes.requestContext);

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getAccountDetails(username: string): Promise<AccountModel[]> {
    const result = await this.client.accounts?.findMany({
      where: {
        username: username
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

  async getAccountDetailsById(id){
    const users = await this.client.accounts?.findMany({
      select: {
        id:true,
        username:true,
        createdAtUtc:true,
        updatedAtUtc:true,
        isAdmin:true
      },
      where: {
        id:id,
        isDeleted:false
      },
    })
    return users ? users[0] : users
  }

}
