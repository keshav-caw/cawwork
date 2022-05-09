import { CommonContainer } from '../common/container'
import { Loggerservice } from '../common/logger/logger.service'
import { CommonTypes } from '../common/common.types'
import { ArgumentValidationError } from '../common/errors/custom-errors/argument-validation.error'
import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { ApiErrorResponsePayload as APIErrorResponsePayload } from 'apps/shared/payloads/api-response-payload'
import { DatabaseError } from '../common/errors/custom-errors/database.error'
import { ThirdPartyAPIError } from '../common/errors/custom-errors/third-party.error'
import { BaseError } from '../common/errors/custom-errors/base.error'
import UnauthorizedError from '../common/errors/custom-errors/unauthorized.error'

const errorMiddleWare = (err, req, res, next) => {
  const logger = CommonContainer.get<Loggerservice>(CommonTypes.logger)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const nextFn = next
  let statusCode: number
  let errorResponse
  let isLogNeeded = false
  switch (true) {
    case err instanceof ArgumentValidationError:
      errorResponse = new APIErrorResponsePayload(
        (<ArgumentValidationError>err).apiErrorCode,
      )
      statusCode = 400
      break
    case err instanceof UnauthorizedError:
      errorResponse = new APIErrorResponsePayload(ApiErrorCode.E0002)
      statusCode = 401
      break
    case err instanceof DatabaseError:
    case err instanceof ThirdPartyAPIError:
    default:
      isLogNeeded = true
      errorResponse = new APIErrorResponsePayload(ApiErrorCode.E0001)
      statusCode = 500
      break
  }

  if (isLogNeeded) {
    logger.error(
      (<BaseError>err).message,
      {},
      'exceptionHandler',
      'ErrorMiddleWare',
    )
  }

  res.status(statusCode).send(errorResponse)
}

export default errorMiddleWare
