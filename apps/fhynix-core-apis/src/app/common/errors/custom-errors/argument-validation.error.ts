import { BaseError } from './base.error'

export class ArgumentValidationError extends BaseError {
  constructor(argName, argValue, apiErrorCode) {
    super(
      'ArgumentError',
      'Invalid argument value. Name: ' + argName + '. Value: ' + argValue,
    )
    this.apiErrorCode = apiErrorCode
  }
}
