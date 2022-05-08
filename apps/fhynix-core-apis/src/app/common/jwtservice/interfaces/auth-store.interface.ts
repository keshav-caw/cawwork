import { AuthModel } from '../../models/auth-model'

export interface AuthStoreInterface {
  getUserId(authToken: AuthModel)
  getUserId()
}
