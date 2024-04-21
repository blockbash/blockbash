import type winston from "winston"

import type { loggerTypes } from "@blockbash/common"

interface Log extends loggerTypes.ILoggerExtendableParams {
  toUser?: boolean
}

interface ILogger extends loggerTypes.ILoggerBase {
  debug: ({ functionName, message, metadata, toUser }: Log) => this
  error: ({ functionName, message, metadata, toUser }: Log) => this
  info: ({ functionName, message, metadata, toUser }: Log) => this
  warn: ({ functionName, message, metadata, toUser }: Log) => this
}

interface LoggerDependencies {
  debugLogFilePath: string
  isDeveloperEnv: boolean
  loggerLib: typeof winston
}

type InternalLogger = winston.Logger

export type { ILogger, InternalLogger, Log, LoggerDependencies }
