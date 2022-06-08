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

  private getStore(){
    const store = this.asyncLocalStorage.getStore();
    return store ? store : {}
  }

  setUserId(userId: string) {
    const store = this.getStore();
    store['userId']=userId
    this.asyncLocalStorage.enterWith(
      store
    )
  }

  setEmail(email: string) {
    const store = this.getStore();
    store['email']=email
    this.asyncLocalStorage.enterWith(
      store
    )
  }

  setAccountId(accountId:string) {
    const store = this.getStore();
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
