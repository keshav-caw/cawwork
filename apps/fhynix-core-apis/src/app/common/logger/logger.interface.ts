export interface LoggerInterface {
  warning(
    message: string,
    data: object,
    callerTypeName: string,
    callerMethodName: string,
  )
  info(
    message: string,
    data: object,
    callerTypeName: string,
    callerMethodName: string,
  )
  error(
    message: string,
    data: object,
    callerTypeName: string,
    callerMethodName: string,
  )
  debug(
    message: string,
    data: object,
    callerTypeName: string,
    callerMethodName: string,
  )
  verbose(
    message: string,
    data: object,
    callerTypeName: string,
    callerMethodName: string,
  )
}
