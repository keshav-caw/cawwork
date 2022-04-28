import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { BaseError } from './base.error'

export class ThirdPartyAPIError extends BaseError {
  constructor(apiErrorCode) {
    super('ThirdPartyAPIError', apiErrorCode)
    this.apiErrorCode = apiErrorCode
    switch (true) {
      case apiErrorCode === ApiErrorCode.E0003:
        this.errMessage = 'Google Authorization failed'
        return
    }
  }
}
