import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { HeartbeatController } from './health-check.controller'

@injectable()
export default class HealthCheckBootstrapper {
  public static initialize() {
    CommonContainer.bind<HeartbeatController>('HealthCheckController').to(
      HeartbeatController,
    )
  }
}
