import { CommonContainer } from '../common/container'
import { CommonTypes } from '../common/common.types'
import { RequestContext } from '../common/jwtservice/requests-context.service'
import UnauthorizedError from '../common/errors/custom-errors/unauthorized.error'
import { AuthRepository } from '../components/accounts/auth.repository'

const checkAdminMiddleWare = async(req, res, next) => {

  const requestContext = CommonContainer.get<RequestContext>(
    CommonTypes.requestContext,
  )

  const authRepository = CommonContainer.get<AuthRepository>('AuthRepository');

  const accountId = requestContext.getAccountId();
  const account = await authRepository.getAccountDetailsById(accountId);
  

  try {
    if(account.isAdmin===false){
      throw new UnauthorizedError();
    }else{
      next();
    }
  } catch (error) {
    next(error);
  }
  
}

export default checkAdminMiddleWare
