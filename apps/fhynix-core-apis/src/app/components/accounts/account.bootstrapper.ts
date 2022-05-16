import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { AccountTypes } from './account.types'
import { AuthRepositoryInterface } from '../../common/interfaces/auth-repository.interface'
import { AuthServiceInterface } from '../../common/interfaces/auth-service.interface'
import { AuthController } from './auth.controller'
import { AuthRepository } from './auth.repository'
import { AuthService } from './auth.service'
import { GoogleAuthProvider } from './google-auth-provider.service'
import { SignupServiceInterface } from '../../common/interfaces/signup-service.interface'
import { SignupService } from './signup.service'

@injectable()
export default class AccountBootstrapper {
  public static initialize() {
    CommonContainer.bind<AuthRepositoryInterface>('AuthRepository').to(
      AuthRepository,
    )
    CommonContainer.bind<AuthServiceInterface>(AccountTypes.auth).to(
      AuthService,
    )
    CommonContainer.bind<GoogleAuthProvider>(AccountTypes.googleAuth).to(
      GoogleAuthProvider,
    )
    CommonContainer.bind<AuthController>('AuthController').to(AuthController)
    CommonContainer.bind<SignupServiceInterface>(AccountTypes.signup).to(SignupService)
  }
}
