import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from './datastore'
import { DataStoreInterface } from './datastore.interface'

@injectable()
export class DataStoreRepository implements DataStoreInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async execute() {
    const result = await this.client?.user?.findMany()
    return result
  }
}
