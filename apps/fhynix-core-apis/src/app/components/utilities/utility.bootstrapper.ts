import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { UtilityController } from './utility.controller'
import { UtilityServiceInterface } from '../../common/interfaces/utility-service.interface'
import { UtilityService } from './utilities.service'
import { UtilityTypes } from './utility.types'

@injectable()
export default class UtilityBootstrapper {
  public static initialize() {
      CommonContainer.bind<UtilityServiceInterface>(UtilityTypes.utlities).to(UtilityService)
      CommonContainer.bind<UtilityController>('UtilityController').to(UtilityController)
  }
}