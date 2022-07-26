import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../../common/container'
import { UtilityController } from './utility.controller'
import { LocationProviderInterface } from '../../common/interfaces/location-provider.interface'
import { LocationProvider } from './location.provider'
import { UtilityTypes } from './utility.types'
import { EmailProviderInterface } from '../../common/interfaces/email-provider.interface'
import { EmailProvider } from './email.provider'
import { TimespanHelperInterface } from '../../common/interfaces/timespan-helper.interface'
import { TimespanHelper } from './timespan.helper'
import { ModelPayloadHelperInterface } from '../../common/interfaces/model-payload-helper.interface'
import { ModelPayloadHelper } from './model-payload.helper'

@injectable()
export default class UtilityBootstrapper {
  public static initialize() {
      CommonContainer.bind<LocationProviderInterface>(UtilityTypes.googleLocations).to(LocationProvider)
      CommonContainer.bind<UtilityController>('UtilityController').to(UtilityController)
      CommonContainer.bind<EmailProviderInterface>(UtilityTypes.emailProvider).to(EmailProvider)
      CommonContainer.bind<TimespanHelperInterface>(UtilityTypes.timespanHelper).to(TimespanHelper)
      CommonContainer.bind<ModelPayloadHelperInterface>(UtilityTypes.modelPayloadHelper).to(ModelPayloadHelper)
  }
}