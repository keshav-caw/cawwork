import { CommonContainer } from '../common/container'
import { JWTService } from '../common/jwtservice/jwt.service'
import { ApiErrorCode } from '../../../../shared/payloads/error-codes'
import { ApiErrorResponsePayload } from '../../../../shared/payloads/api-response-payload'
import { CommonTypes } from '../common/common.types'

export class JWTAuthMiddleWare {
  jwtService = CommonContainer.get<JWTService>(CommonTypes.jwt)
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
