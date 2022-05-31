import { ResponsePayloadBase } from './base-response.payload'

export class ApiErrorResponsePayload extends ResponsePayloadBase {
  apiErrorCode: string
  constructor(errorCode) {
    super()
    this.apiErrorCode = errorCode
  }
}
