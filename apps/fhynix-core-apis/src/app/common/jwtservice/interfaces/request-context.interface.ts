import { AuthModel } from '../../models/auth-model'

export interface IRequestContext {
  getUserId(authToken: AuthModel)
  getUserId()
}
