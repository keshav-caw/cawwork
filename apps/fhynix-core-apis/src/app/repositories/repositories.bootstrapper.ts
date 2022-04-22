import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../common/container'
import { DataStoreRepository } from '../common/data/base.repository'
import { DataStore } from '../common/data/datastore'
import { DataStoreInterface } from '../common/data/datastore.interface'

@injectable()
export default class RepositoriesBootstrapper {
  public static initialize() {
    CommonContainer.bind<DataStore>('DataStore').to(DataStore)
    CommonContainer.bind<DataStoreInterface>('DataStoreRepository').to(
      DataStoreRepository,
    )
  }
}
