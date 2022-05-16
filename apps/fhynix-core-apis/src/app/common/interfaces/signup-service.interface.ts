import { UserSignupModel } from '../models/user-signup-model'

export interface SignupServiceInterface {
  signup(userDetails: UserSignupModel)
}