import { injectable } from 'inversify'
import 'reflect-metadata'
import { AsyncLocalStorage } from 'async_hooks'
import { IRequestContext } from './interfaces/request-context.interface'

@injectable()
export class RequestContext implements IRequestContext {
  asyncLocalStorage
  constructor() {
    this.asyncLocalStorage = new AsyncLocalStorage()
  }

  async setUserId(userId: string) {
    this.asyncLocalStorage.enterWith({
      userId: userId,
    })
  }

  async setEmailId(email: string) {
    this.asyncLocalStorage.enterWith({
      email: email,
    })
  }

  getUserId() {
    return this.asyncLocalStorage.getStore()?.['userId']
  }
}
