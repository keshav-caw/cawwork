import { UserLoginModel } from '../models/user-login-model'

export interface AuthServiceInterface {
  login(userDetails: UserLoginModel)
  updateAccountDetails(
    accessToken: string,
    refreshToken: string,
    accountId: string,
  )
}
