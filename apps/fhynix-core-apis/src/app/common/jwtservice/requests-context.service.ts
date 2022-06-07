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
    this.asyncLocalStorage.enterWith({
      userId: userId,
    })
  }

  setEmail(email: string) {
    this.asyncLocalStorage.enterWith({
      email: email,
    })
  }

  setAccountId(accountId:string) {
    this.asyncLocalStorage.enterWith({
      accountId: accountId,
    })
  }

  setIds(accountId:string,userId:string){
    this.asyncLocalStorage.enterWith({
      accountId: accountId,
      userId:userId
    })
  }

  getUserId() {
    return this.asyncLocalStorage.getStore()?.['userId']
  }

  getAccountId() {
    return this.asyncLocalStorage.getStore()?.['accountId']
  }
}
