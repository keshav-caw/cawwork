import { injectable } from 'inversify'
import 'reflect-metadata'
import { AsyncLocalStorage } from 'async_hooks'
import { AuthStoreInterface as IRequestContext } from './interfaces/auth-store.interface'
import { AuthModel } from '../models/auth-model'

@injectable()
export class RequestContext implements IRequestContext {
  asyncLocalStorage
  constructor() {
    this.asyncLocalStorage = new AsyncLocalStorage()
  }
  async setAuthToken(authToken: AuthModel) {
    this.asyncLocalStorage.enterWith({ userId: authToken.userId })
    this.asyncLocalStorage.enterWith({ email: authToken.email })
  }

  getUserId() {
    return this.asyncLocalStorage.getStore()?.['userId']
  }
}
