import { injectable } from 'inversify'
import 'reflect-metadata'
import { Loggerservice } from './logger/logger.service'
import { CommonTypes } from './common.types'
import { CommonContainer } from './container'
import { LoggerInterface } from './logger/logger.interface'

@injectable()
export default class CommonBootstrapper {
  public static initialize() {
    CommonContainer.bind<LoggerInterface>(CommonTypes.logger).to(Loggerservice)
  }
}
