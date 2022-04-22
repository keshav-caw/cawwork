import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../common/container'
import { JWTInterface } from './interfaces/jwt.interface'
import { JWTService } from './jwt.service'
import { ServiceTypes } from './service.types'

@injectable()
export default class ServicesBootstrapper {
  public static initialize() {
    CommonContainer.bind<JWTInterface>(ServiceTypes.jwt).to(JWTService)
  }
}
