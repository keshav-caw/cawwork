import { PrismaClient } from '@prisma/client'
import { injectable } from 'inversify'

@injectable()
export class DataStore {
  public static dbClient

  public getClient() {
    return DataStore.dbClient
  }

  public static initialize() {
    this.dbClient = new PrismaClient()

    this.dbClient.$use(async (params, next) => {

      if(params.action=='create' || params.action=='update'){
        params.args.data.updatedAtUtc =  new Date();
      }
      if(params.action=='upsert'){
        params.args.update.updatedAtUtc =  new Date();
        params.args.create.updatedAtUtc =  new Date();
      }
      
      const result = await next(params)
      return result
    })
  }
}
