import { CommonContainer } from '../common/container'
import { JWTService } from '../common/jwtservice/jwt.service'
import { ApiErrorCode } from '../../../../shared/payloads/error-codes'
import { CommonTypes } from '../common/common.types'
import { RequestContext } from '../common/jwtservice/requests-context.service'
import UnauthorizedError from '../common/errors/custom-errors/unauthorized.error'
import { ArgumentValidationError } from '../common/errors/custom-errors/argument-validation.error'
import { AuthRepository } from '../components/accounts/auth.repository'

const jwtMiddleWare = (req, res, next) => {
  const jwtService = CommonContainer.get<JWTService>(CommonTypes.jwt)
  const requestContext = CommonContainer.get<RequestContext>(
    CommonTypes.requestContext,
  )
  const authRepository = CommonContainer.get<AuthRepository>('AuthRepository');
  if (!req.headers.authorization) {
    throw new ArgumentValidationError(
      'Access token is missing',
      '',
      ApiErrorCode.E0002,
    )
  } else {
    try {
      if (jwtService.validate(req.headers.authorization)) {
        const authToken = jwtService.decode(req.headers.authorization)
        requestContext.setIds(authToken.accountId,authToken.userId)
        next()
      }
    } catch (e) {
      next(new UnauthorizedError());
    }
  }
}

export default jwtMiddleWare
