import { type loggerTypes } from "@blockbash/common"
import { type Logger as LoggerLib } from "tslog"

interface LoggerDependencies {
  LoggerLib: typeof LoggerLib
}

type CreateLogger = () => ILogger

type ILogger = loggerTypes.ILoggerMin

export type { CreateLogger, ILogger, LoggerDependencies }
