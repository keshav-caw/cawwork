import { CommonContainer } from '../common/container'
import { JWTService } from '../common/jwtservice/jwt.service'
import { ApiErrorCode } from '../../../../shared/payloads/error-codes'
import { ApiErrorResponsePayload } from '../../../../shared/payloads/api-response-payload'
import { CommonTypes } from '../common/common.types'
import { AuthStoreService } from '../common/jwtservice/auth-store.service'

const jwtMiddleWare = (req, res, next) => {
  const jwtService = CommonContainer.get<JWTService>(CommonTypes.jwt)
  const authStoreService = CommonContainer.get<AuthStoreService>(
    CommonTypes.authStoreService,
  )
  if (req.headers.authorization) {
    if (jwtService.validate(req.headers.authorization)) {
      const authToken = jwtService.decode(req.headers.authorization)
      authStoreService.setAuthToken(authToken)
      next()
    } else {
      return next(new ApiErrorResponsePayload(ApiErrorCode.E0003))
    }
  } else {
    return next(new ApiErrorResponsePayload(ApiErrorCode.E0003))
  }
}

export default jwtMiddleWare
