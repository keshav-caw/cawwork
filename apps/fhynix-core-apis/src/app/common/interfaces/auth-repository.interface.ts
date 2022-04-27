import { AccountModel } from '../models/account-model'

export interface AuthRepositoryInterface {
  getAccountDetails(username: string)
  createAccounts(accountDetails: AccountModel)
  updateAccounts(accountDetails: AccountModel, accountId: string)
}
