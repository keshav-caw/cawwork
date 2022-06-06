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

  async setEmail(email: string) {
    this.asyncLocalStorage.enterWith({
      email: email,
    })
  }

  async setAccountId(accountId:string) {
    this.asyncLocalStorage.enterWith({
      accountId: accountId,
    })
  }

  getUserId() {
    return this.asyncLocalStorage.getStore()?.['userId']
  }

  getAccountId() {
    return this.asyncLocalStorage.getStore()?.['accountId']
  }
}
