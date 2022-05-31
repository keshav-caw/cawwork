import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { UtilityController } from './utility.controller'
import { LocationServiceInterface } from '../../common/interfaces/location-service.interface'
import { GoogleLocationService } from './utilities.service'
import { UtilityTypes } from './utility.types'

@injectable()
export default class UtilityBootstrapper {
  public static initialize() {
      CommonContainer.bind<LocationServiceInterface>(UtilityTypes.googleLocations).to(GoogleLocationService)
      CommonContainer.bind<UtilityController>('UtilityController').to(UtilityController)
  }
}