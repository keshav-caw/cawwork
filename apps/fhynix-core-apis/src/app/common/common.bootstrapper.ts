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
import { RequestContext } from './jwtservice/requests-context.service'
import { HashServiceInterface } from './hashservice/hash-service.interface'
import { HashService } from './hashservice/hash.service'
import { StorageProviderInterface } from './interfaces/storage-provider.interface'
import { StorageProvider } from './storage-provider/storage-provider.service'
import { RequestContextInterface } from './jwtservice/interfaces/request-context.interface'
import { LinkPreviewProviderInterface } from './linkPreviewProvider/linkPreview-provider.interface'
import { LinkPreviewProvider } from './linkPreviewProvider/linkPreview.provider'

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
    CommonContainer.bind<RequestContextInterface>(CommonTypes.requestContext)
      .to(RequestContext)
      .inSingletonScope()
    CommonContainer.bind<HashServiceInterface>(CommonTypes.hash).to(HashService)
    CommonContainer.bind<StorageProviderInterface>(CommonTypes.storage).to(
      StorageProvider,
    )
    CommonContainer.bind<LinkPreviewProviderInterface>(
      CommonTypes.linkPreview,
    ).to(LinkPreviewProvider)
  }
}
