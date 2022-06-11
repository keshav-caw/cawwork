import { AuthModel } from '../../models/auth-model'

export interface RequestContextInterface {
  getUserId(authToken: AuthModel)
  getUserId()
}
