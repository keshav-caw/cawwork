import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { HabitsRepositoryInterface } from '../../common/interfaces/habits-repository.interface'
import { HabitsServiceInterface } from '../../common/interfaces/habits-service.interface'
import { HabitsController } from './habits.controller'
import { HabitsRepository } from './habits.repository'
import { HabitsService } from './habits.service'
import { HabitsTypes } from './habits.types'

@injectable()
export default class HabitsBootstrapper {
  public static initialize() {
    CommonContainer.bind<HabitsRepositoryInterface>('HabitsRepository').to(
      HabitsRepository,
    )
    CommonContainer.bind<HabitsServiceInterface>(HabitsTypes.habits).to(
      HabitsService,
    )
    CommonContainer.bind<HabitsController>('HabitsController').to(
      HabitsController,
    )
  }
}
