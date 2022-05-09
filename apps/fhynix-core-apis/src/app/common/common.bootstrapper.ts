import { injectable } from 'inversify'
import 'reflect-metadata'
import { Loggerservice } from './logger/logger.service'
import { CommonTypes } from './common.types'
import { CommonContainer } from './container'
import { LoggerInterface } from './logger/logger.interface'
import { DataStoreRepository } from './data/base.repository'
import { DataStore } from './data/datastore'
import { DataStoreInterface } from './data/datastore.interface'
import { JWTInterface } from './jwtservice/interfaces/jwt.interface'
import { JWTService } from './jwtservice/jwt.service'
import { RequestContext } from './jwtservice/requets-context.service'
import { IRequestContext } from './jwtservice/interfaces/request-context.interface'

@injectable()
export default class CommonBootstrapper {
  public static initialize() {
    CommonContainer.bind<LoggerInterface>(CommonTypes.logger).to(Loggerservice)
    this.initializeDataStore()
  }

  private static initializeDataStore() {
    CommonContainer.bind<DataStore>('DataStore').to(DataStore)
    CommonContainer.bind<DataStoreInterface>('DataStoreRepository').to(
      DataStoreRepository,
    )
    CommonContainer.bind<JWTInterface>(CommonTypes.jwt).to(JWTService)
    CommonContainer.bind<IRequestContext>(CommonTypes.requestContext)
      .to(RequestContext)
      .inSingletonScope()
  }
}
