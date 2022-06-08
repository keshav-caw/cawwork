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

  setUserId(userId: string) {
    let store = this.asyncLocalStorage.getStore();
    store = store ? store : {}
    store['userId']=userId
    this.asyncLocalStorage.enterWith(
      store
    )
  }

  setEmail(email: string) {
    let store = this.asyncLocalStorage.getStore();
    store = store ? store : {}
    store['email']=email
    this.asyncLocalStorage.enterWith(
      store
    )
  }

  setAccountId(accountId:string) {
    let store = this.asyncLocalStorage.getStore();
    store = store ? store : {}
    store['accountId']=accountId
    this.asyncLocalStorage.enterWith(
      store
    )
  }

  getUserId() {
    return this.asyncLocalStorage.getStore()?.['userId']
  }

  getAccountId() {
    return this.asyncLocalStorage.getStore()?.['accountId']
  }
}
