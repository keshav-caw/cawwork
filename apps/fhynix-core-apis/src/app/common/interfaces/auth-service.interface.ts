import { UserLoginModel } from '../models/user-login-model'
import { UserModel } from '../models/user-model'

export interface AuthServiceInterface {
  login(userDetails: UserLoginModel)
  updateAccountDetails({
    accessToken,
    refreshToken,
    accountId,
  }): Promise<UserModel>
  signup(userDetails)
}
