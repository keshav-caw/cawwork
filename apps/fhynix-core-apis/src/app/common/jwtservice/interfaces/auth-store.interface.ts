import { AuthModel } from '../../models/auth-model'

export interface AuthStoreInterface {
  getAuthTokenInfo(authToken: AuthModel)
  getAuthTokenInfo()
}
