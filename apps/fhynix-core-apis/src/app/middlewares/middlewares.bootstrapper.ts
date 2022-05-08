import { injectable } from 'inversify'
import 'reflect-metadata'
import { CommonContainer } from '../common/container'
import * as express from 'express'
import jwtMiddleWare from './jwt-auth.middleware'
import { CommonTypes } from '../common/common.types'
import { RequestIdMiddleware } from './request-id.middleware'

@injectable()
export default class MiddlewaresBootstrapper {
  public static initialize() {
    // initializer
    CommonContainer.bind<express.RequestHandler>(
      CommonTypes.jwtAuthMiddleware,
    ).toConstantValue(jwtMiddleWare)
    CommonContainer.bind<RequestIdMiddleware>(
      CommonTypes.requestIdMiddleware,
    ).to(RequestIdMiddleware)
  }
}
