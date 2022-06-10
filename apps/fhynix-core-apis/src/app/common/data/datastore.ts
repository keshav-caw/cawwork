import { PrismaClient } from '@prisma/client'
import { injectable } from 'inversify'
import { CommonTypes } from '../common.types'
import { CommonContainer } from '../container'
import { RequestContext } from '../jwtservice/requests-context.service'

@injectable()
export class DataStore {
  public static dbClient
  public static requestContext;

  public getClient() {
    return DataStore.dbClient
  }

  public static initialize() {
    this.dbClient = new PrismaClient();
    this.requestContext =  CommonContainer.get<RequestContext>(
      CommonTypes.requestContext,
    )

    this.dbClient.$use(async (params, next) => {
      const userId = this.requestContext.getUserId()
      
      if(params.action=='upsert'){
        params.args.update.updatedBy = userId;
        params.args.create.updatedBy = userId;
        params.args.create.createdBy = userId;
      }
      else if(params.action=='create'){
        params.args.data.updatedBy =userId;
        params.args.data.createdBy = userId;
      }
      else if(params.action=='update'){
        params.args.data.updatedBy =userId;
      }
      
      const result = await next(params)
      return result
    })
  }
}
