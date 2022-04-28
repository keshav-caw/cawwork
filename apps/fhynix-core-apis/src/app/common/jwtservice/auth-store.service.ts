import { injectable } from 'inversify'
import 'reflect-metadata'
import { AsyncLocalStorage } from 'async_hooks'
import { AuthStoreInterface } from './interfaces/auth-store.interface'
import { AuthModel } from '../models/auth-model'

@injectable()
export class AuthStoreService implements AuthStoreInterface {
  asyncLocalStorage
  constructor() {
    this.asyncLocalStorage = new AsyncLocalStorage()
  }
  async setAuthToken(authToken: AuthModel) {
    this.asyncLocalStorage.enterWith({ authToken: authToken })
  }

  getAuthTokenInfo() {
    return this.asyncLocalStorage.getStore()?.['authToken']
  }
}
