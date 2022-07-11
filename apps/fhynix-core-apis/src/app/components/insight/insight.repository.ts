import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { DataStore } from '../../common/data/datastore'
import { InsightRepositoryInterface } from '../../common/interfaces/insight-repository.interface'
import { InsightModel } from '../../common/models/insight.model'
@injectable()
export class InsightRepository implements InsightRepositoryInterface {
  protected client

  constructor(@inject('DataStore') protected store: DataStore) {
    this.client = this.store.getClient()
  }

  async getCohortInsights(): Promise<InsightModel[]> {
    const result = await this.client.cohortInsights?.findMany({
      where: {
        isDeleted: false,
      },
    })
    return result
  }
}
