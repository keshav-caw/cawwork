import { CommonContainer } from '../common/container'
import { JWTService } from '../common/jwtservice/jwt.service'
import { ApiErrorCode } from '../../../../shared/payloads/error-codes'
import { ApiErrorResponsePayload } from '../../../../shared/payloads/api-response-payload'
import { CommonTypes } from '../common/common.types'
import { RequestContext } from '../common/jwtservice/auth-store.service'
import UnauthorizedError from '../common/errors/custom-errors/unauthorized.error'

const jwtMiddleWare = (req, res, next) => {
  const jwtService = CommonContainer.get<JWTService>(CommonTypes.jwt)
  const requestContext = CommonContainer.get<RequestContext>(
    CommonTypes.requestContext,
  )
  if (req.headers.authorization) {
    try {
      if (jwtService.validate(req.headers.authorization)) {
        const authToken = jwtService.decode(req.headers.authorization)
        requestContext.setUserId(authToken)
        next()
      }
    } catch (e) {
      throw new UnauthorizedError()
    }
  } else {
    return next(new ApiErrorResponsePayload(ApiErrorCode.E0003))
  }
}

export default jwtMiddleWare
