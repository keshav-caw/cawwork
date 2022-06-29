import { inject, injectable } from 'inversify'
import 'reflect-metadata'
import { TimespanHelperInterface } from '../../common/interfaces/timespan-helper.interface';

@injectable()
export class TimespanHelper implements TimespanHelperInterface {

  get nextFourteenDays(){
    const startDate = new Date();
    const startDateInUtc = startDate.toISOString();
    const endDate = new Date(startDate.setDate(startDate.getDate() + 14));
    const endDateInUtc = endDate.toISOString();
    return {
        startDateInUtc,
        endDateInUtc
    }
  }
}
