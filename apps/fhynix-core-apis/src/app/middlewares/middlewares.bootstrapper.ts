import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../common/container'
import * as express from 'express'
import jwtMiddleware from './jwt-auth.middleware'
import { CommonTypes } from '../common/common.types'
import { RequestIdMiddleware } from './request-id.middleware'
import checkAdminMiddleware from './check-admin.middleware'

@injectable()
export default class MiddlewaresBootstrapper {
  public static initialize() {
    CommonContainer.bind<express.RequestHandler>(
      CommonTypes.jwtAuthMiddleware,
    ).toConstantValue(jwtMiddleware)
    CommonContainer.bind<RequestIdMiddleware>(
      CommonTypes.requestIdMiddleware,
    ).to(RequestIdMiddleware)
    CommonContainer.bind<express.RequestHandler>(
      CommonTypes.checkAdminMiddleware,
    ).toConstantValue(checkAdminMiddleware)
  }
}
