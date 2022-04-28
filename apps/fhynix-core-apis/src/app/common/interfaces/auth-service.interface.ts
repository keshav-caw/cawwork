import { UserLoginModel } from '../models/user-login-model'

export interface AuthServiceInterface {
  login(userDetails: UserLoginModel)
  updateAccountDetails(
    access_token: string,
    refresh_token: string,
    accountId: string,
  )
}
