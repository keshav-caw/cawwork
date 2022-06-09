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

      if(params.action=='create' || params.action=='update'){
        params.args.data.updatedAtUtc =  new Date();
        params.args.data.updatedBy = this.requestContext.getUserId();
      }
      if(params.action=='create'){
        params.args.data.createdAtUtc =  new Date();
        params.args.data.createdBy = this.requestContext.getUserId();
      }
      if(params.action=='upsert'){
        params.args.update.updatedAtUtc =  new Date();
        params.args.create.updatedAtUtc =  new Date();
        params.args.update.updatedBy = this.requestContext.getUserId();
        params.args.create.updatedBy = this.requestContext.getUserId();
      }
      
      const result = await next(params)
      return result
    })
  }
}
