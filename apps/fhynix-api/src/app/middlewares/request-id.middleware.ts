import { AsyncLocalStorage } from 'async_hooks'

export class RequestIdMiddleware {
  async setRequestId(req, res) {
    const asyncLocalStorage = new AsyncLocalStorage()
    asyncLocalStorage.enterWith({
      'x-request-id': req.headers['x-request-id'],
    })
  }
}
