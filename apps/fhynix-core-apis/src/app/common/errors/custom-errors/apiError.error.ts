import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { BaseError } from './base.error'

export class ApiError extends BaseError {
  constructor(apiErrorCode) {
    super('ApiError', 'Unhandled exception')
    this.apiErrorCode = apiErrorCode
    switch (true) {
      case apiErrorCode === ApiErrorCode.E0004:
        this.errMessage = 'Invalid Credentials'
        return
    }
  }
}
