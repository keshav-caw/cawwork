import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { ActivityRepositoryInterface } from '../../common/interfaces/habits-repository.interface'
import { ActivityServiceInterface } from '../../common/interfaces/habits-service.interface'
import { HabitsController } from './habits.controller'
import { ActivityRepository } from './habits.repository'
import { ActivityService } from './habits.service'
import { ActivityTypes } from './habits.types'

@injectable()
export default class ActivityBootstrapper {
  public static initialize() {
    CommonContainer.bind<ActivityRepositoryInterface>('ActivityRepository').to(
      ActivityRepository,
    )
    CommonContainer.bind<ActivityServiceInterface>(ActivityTypes.activity).to(
      ActivityService,
    )
    CommonContainer.bind<HabitsController>('HabitsController').to(
      HabitsController,
    )
  }
}
