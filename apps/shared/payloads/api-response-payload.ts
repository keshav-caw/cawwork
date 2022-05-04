import { PayloadBase } from './base-payload'

export class ApiErrorResponsePayload extends PayloadBase {
  apiErrorCode: string
  constructor(errorCode) {
    super()
    this.apiErrorCode = errorCode
  }
}
