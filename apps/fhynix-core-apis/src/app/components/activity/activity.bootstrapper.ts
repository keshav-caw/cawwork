import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { ActivityRepositoryInterface } from '../../common/interfaces/activity-repository.interface'
import { ActivityServiceInterface } from '../../common/interfaces/activity-service.interface'
import { ActivityController } from './activity.controller'
import { ActivityRepository } from './activity.repository'
import { ActivityService } from './activity.service'
import { ActivityTypes } from './activity.types'

@injectable()
export default class ActivityBootstrapper {
  public static initialize() {
    CommonContainer.bind<ActivityRepositoryInterface>('ActivityRepository').to(
      ActivityRepository,
    )
    CommonContainer.bind<ActivityServiceInterface>(ActivityTypes.activity).to(
      ActivityService,
    )
    CommonContainer.bind<ActivityController>('ActivityController').to(
      ActivityController,
    )
  }
}
