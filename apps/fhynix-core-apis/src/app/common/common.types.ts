const CommonTypes = {
  logger: Symbol.for('LoggerInterface'),
  jwt: Symbol.for('JWTInterface'),
  requestContext: Symbol.for('RequestContext'),
  jwtAuthMiddleware: Symbol.for('JWTAuthMiddleWare'),
  requestIdMiddleware: Symbol.for('RequestIdMiddleware'),
  hash: Symbol.for('HashInterface'),
  storage: Symbol.for('StorageProvider'),
  linkPreview: Symbol.for('LinkPreview'),
  checkAdminMiddleWare: Symbol.for('CheckAdminMiddleWare'),
}

export { CommonTypes }
