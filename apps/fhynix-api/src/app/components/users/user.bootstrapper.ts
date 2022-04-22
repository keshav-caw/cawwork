import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { UserRepositoryInterface } from './user-repository.interface'
import { UserServiceInterface } from './user-service.interface'
import { UserController } from './user.controller'
import { UserRepository } from './user.repository'
import { UserService } from './user.service'
import { UserTypes } from './user.types'

@injectable()
export default class UserBootstrapper {
  public static initialize() {
    CommonContainer.bind<UserRepositoryInterface>('UserRepository').to(
      UserRepository,
    )
    CommonContainer.bind<UserServiceInterface>(UserTypes.user).to(UserService)
    CommonContainer.bind<UserController>('UserController').to(UserController)
  }
}
