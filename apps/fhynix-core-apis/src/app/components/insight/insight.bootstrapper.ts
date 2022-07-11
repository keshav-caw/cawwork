import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { InsightRepositoryInterface } from '../../common/interfaces/insight-repository.interface'
import { InsightServiceInterface } from '../../common/interfaces/insight-service.interface'
import { InsightController } from './insight.controller'
import { InsightRepository } from './insight.repository'
import { InsightService } from './insight.service'
import { InsightTypes } from './insight.types'

@injectable()
export default class InsightpBootstrapper {
  public static initialize() {
    CommonContainer.bind<InsightRepositoryInterface>('InsightRepository').to(
      InsightRepository,
    )
    CommonContainer.bind<InsightServiceInterface>(InsightTypes.insight).to(
      InsightService,
    )
    CommonContainer.bind<InsightController>('InsightController').to(
      InsightController,
    )
  }
}
