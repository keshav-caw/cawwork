import { injectable } from 'inversify'
import 'reflect-metadata'
import winston from 'winston'
import { LoggerInterface } from './logger.interface'
import { omit } from 'lodash'
import { LoggerLevel } from './logger-level.enum'
import { environment } from '../../../environments/environment'
import { AsyncLocalStorage } from 'async_hooks'

@injectable()
export class Loggerservice implements LoggerInterface {
  private logger: winston.Logger

  constructor() {
    this.logger = winston.createLogger({
      level: 'debug',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          handleExceptions: true,
          stderrLevels: ['warning', 'error'],
        }),
      ],
    })
  }

  warning(
    message: string,
    data: object,
    callerTypeName: string,
    callerMethodName: string,
  ) {
    const logEntry = this.getLogEntry(
      LoggerLevel.Verbose,
      callerTypeName,
      callerMethodName,
      data,
    )
    this.log(LoggerLevel.Verbose, message, logEntry)
  }
  info(
    message: string,
    data: object,
    callerTypeName: string,
    callerMethodName: string,
  ) {
    const logEntry = this.getLogEntry(
      LoggerLevel.Verbose,
      callerTypeName,
      callerMethodName,
      data,
    )
    this.log(LoggerLevel.Verbose, message, logEntry)
  }
  error(
    message: string,
    data: object,
    callerTypeName: string,
    callerMethodName: string,
  ) {
    const logEntry = this.getLogEntry(
      LoggerLevel.Verbose,
      callerTypeName,
      callerMethodName,
      data,
    )
    this.log(LoggerLevel.Verbose, message, logEntry)
  }
  debug(
    message: string,
    data: object,
    callerTypeName: string,
    callerMethodName: string,
  ) {
    const logEntry = this.getLogEntry(
      LoggerLevel.Verbose,
      callerTypeName,
      callerMethodName,
      data,
    )
    this.log(LoggerLevel.Verbose, message, logEntry)
  }
  verbose(
    message: string,
    data: object,
    callerTypeName: string,
    callerMethodName: string,
  ) {
    const logEntry = this.getLogEntry(
      LoggerLevel.Verbose,
      callerTypeName,
      callerMethodName,
      data,
    )
    this.log(LoggerLevel.Verbose, message, logEntry)
  }

  log(level: string, message: string, logEntry: object) {
    this.logger.log(level, message, omit(logEntry, 'level'))
  }

  private getLogEntry = (
    level,
    callerTypeName,
    callerMethodName,
    data,
  ): any => {
    const asyncLocalStorage = new AsyncLocalStorage()
    const logEntry: any = {
      callerTypeName: callerTypeName,
      level,
      callerMethodName,
      createdAt: new Date().toJSON(),
      'x-request-id': asyncLocalStorage.getStore(),
    }
    logEntry.env = environment.envName
    logEntry.data = omit(data)
    return logEntry
  }
}
