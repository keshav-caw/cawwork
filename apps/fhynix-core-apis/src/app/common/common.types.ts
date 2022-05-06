const CommonTypes = {
  logger: Symbol.for('LoggerInterface'),
  jwt: Symbol.for('JWTInterface'),
  authStoreService: Symbol.for('AuthStoreService'),
  jwtAuthMiddleware: Symbol.for('JWTAuthMiddleWare'),
  requestIdMiddleware: Symbol.for('RequestIdMiddleware'),
}

export { CommonTypes }
