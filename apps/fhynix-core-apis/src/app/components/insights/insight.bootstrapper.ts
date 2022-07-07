import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { InsightServiceInterface } from '../../common/interfaces/insight-service.interface'
import { InsightController } from './insight.controller'
import { InsightService } from './insight.service'
import { InsightTypes } from './insight.types'

@injectable()
export default class InsightpBootstrapper {
  public static initialize() {
    CommonContainer.bind<InsightServiceInterface>(InsightTypes.insight).to(
      InsightService,
    )
    CommonContainer.bind<InsightController>('InsightController').to(
      InsightController,
    )
  }
}
