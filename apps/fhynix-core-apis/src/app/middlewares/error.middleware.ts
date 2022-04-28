import { CommonContainer } from '../common/container'
import { Loggerservice } from '../common/logger/logger.service'
import { CommonTypes } from '../common/common.types'
import { ArgumentValidationError } from '../common/errors/custom-errors/argument-validation.error'
import { ApiErrorCode } from 'apps/shared/payloads/error-codes'
import { ApiErrorResponsePayload } from 'apps/shared/payloads/api-response-payload'
import { DatabaseError } from '../common/errors/custom-errors/database.error'
import { ThirdPartyAPIError } from '../common/errors/custom-errors/third-party.error'
import { ApiError } from '../common/errors/custom-errors/apiError.error'

const errorMiddleWare = (err, req, res, next) => {
  const logger = CommonContainer.get<Loggerservice>(CommonTypes.logger)
  switch (true) {
    case err instanceof ArgumentValidationError:
      return new ApiErrorResponsePayload(ApiErrorCode.E0001)
    case err instanceof DatabaseError:
      return new ApiErrorResponsePayload(ApiErrorCode.E0002)
    case err instanceof ThirdPartyAPIError:
      res.status(400).send({ error: err, status: 400 })
      return
    case err instanceof ApiError:
      res.status(400).send({ error: err, status: 400 })
      return
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
