import { CommonContainer } from '../common/container'
import { Loggerservice } from '../common/logger/logger.service'
import { CommonTypes } from '../common/common.types'
import { ArgumentValidationError } from '../common/errors/custom-errors/argument-validation.error'
import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { ApiErrorResponsePayload } from 'apps/shared/payloads/api-response-payload'
import { DatabaseError } from '../common/errors/custom-errors/database.error'
import { ThirdPartyAPIError } from '../common/errors/custom-errors/third-party.error'

const errorMiddleWare = (err, req, res, next) => {
  const logger = CommonContainer.get<Loggerservice>(CommonTypes.logger)
  switch (true) {
    case err instanceof ArgumentValidationError:
      return new ApiErrorResponsePayload(ApiErrorCode.E0003)
    case err instanceof DatabaseError:
      return new ApiErrorResponsePayload(ApiErrorCode.E0001)
    case err instanceof ThirdPartyAPIError:
      return new ApiErrorResponsePayload(ApiErrorCode.E0001)
    default: {
      logger.error(
        'Exceptional Error',
        err,
        'exceptionHandler',
        'ErrorMiddleWare',
      )
      res.send(500)
      return new ApiErrorResponsePayload(ApiErrorCode.E0001)
    }
  }
}

export default errorMiddleWare
