import { CommonContainer } from '../common/container'
import { JWTService } from '../services/jwt.service'
import { ServiceTypes } from '../services/service.types'
import { ApiErrorCode } from '../../../../shared/payloads/error-codes'
import { ApiErrorResponsePayload } from '../../../../shared/payloads/api-response-payload'

export class JWTAuthMiddleWare {
  jwtService = CommonContainer.get<JWTService>(ServiceTypes.jwt)
  authenticate(req, res, next) {
    if (req.headers.Authorization) {
      if (this.jwtService.validate(req.headers.Authorization)) {
        return next(new ApiErrorResponsePayload(ApiErrorCode.E0002))
      }
      return next()
    } else {
      return next(new ApiErrorResponsePayload(ApiErrorCode.E0003))
    }
  }
}
