import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { AccountTypes } from './account.types'
import { AuthRepositoryInterface } from './auth-repository.interface'
import { AuthServiceInterface } from './auth-service.interface'
import { AuthController } from './auth.controller'
import { AuthRepository } from './auth.repository'
import { AuthService } from './auth.service'

@injectable()
export default class AccountBootstrapper {
  public static initialize() {
    CommonContainer.bind<AuthRepositoryInterface>('AuthRepository').to(
      AuthRepository,
    )
    CommonContainer.bind<AuthServiceInterface>(AccountTypes.auth).to(
      AuthService,
    )
    CommonContainer.bind<AuthController>('AuthController').to(AuthController)
  }
}
