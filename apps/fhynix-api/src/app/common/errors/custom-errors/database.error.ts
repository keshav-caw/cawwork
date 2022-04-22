import { BaseError } from './base.error'

export class DatabaseError extends BaseError {
  constructor(message) {
    super('DatabaseError', message)
  }
}
