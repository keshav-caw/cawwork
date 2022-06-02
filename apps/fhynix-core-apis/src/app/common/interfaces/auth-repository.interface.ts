import { AccountModel } from '../models/account-model'

export interface AuthRepositoryInterface {
  getAccountDetails(username: string): Promise<AccountModel[]>
  createAccounts(accountDetails: AccountModel): Promise<AccountModel>
  updateAccounts(
    accountDetails: AccountModel,
    accountId: string,
  ): Promise<AccountModel>
  rejectIfNotAdmin():Promise<void>
}
