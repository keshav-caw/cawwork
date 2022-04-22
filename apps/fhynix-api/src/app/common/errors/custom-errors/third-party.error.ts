import { BaseError } from './base.error'

export class ThirdPartyAPIError extends BaseError {
  constructor(message) {
    super('ThirdPartyAPIError', message)
  }
}
