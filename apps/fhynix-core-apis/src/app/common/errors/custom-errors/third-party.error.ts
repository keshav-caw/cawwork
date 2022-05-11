import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { BaseError } from './base.error'

export class ThirdPartyAPIError extends BaseError {
  constructor(apiErrorCode) {
    super('ThirdPartyAPIError', apiErrorCode)
  }
}
