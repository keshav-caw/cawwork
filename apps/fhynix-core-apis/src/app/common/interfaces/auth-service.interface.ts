import { UserLoginModel } from '../models/user-login-model'
import { UserModel } from '../models/user-model'
import { UserSignupModel } from '../models/user-signup-model'

export interface AuthServiceInterface {
  login(userDetails: UserLoginModel)
  updateAccountDetails({
    accessToken,
    refreshToken,
    accountId,
  }): Promise<UserModel>
}

export interface SignupServiceInterface {
  signup(userDetails: UserSignupModel)
}