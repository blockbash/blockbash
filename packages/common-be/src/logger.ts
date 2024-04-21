import type { loggerTypes } from "@blockbash/common"

import { Levels, LogMessages } from "./logger.constants"
import type {
  ILogger,
  InternalLogger,
  Log,
  LoggerDependencies
} from "./logger.types"

export class Logger implements ILogger {
  private className: string | undefined

  private readonly debugLogFilePath: LoggerDependencies["debugLogFilePath"]

  private isContextSet = false

  private readonly isDeveloperEnv: LoggerDependencies["isDeveloperEnv"]

  private readonly logger: InternalLogger

  private readonly loggerLib: LoggerDependencies["loggerLib"]

  private logicPath: string | undefined

  private readonly problemLevels = [Levels.WARN, Levels.ERROR]

  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: LoggerDependencies
  }) {
    this.loggerLib = injectedDependencies.loggerLib
    this.isDeveloperEnv = injectedDependencies.isDeveloperEnv
    this.debugLogFilePath = injectedDependencies.debugLogFilePath
    this.logger = this.initLogger()
  }

  private createLog({
    functionName,
    level,
    message,
    metadata,
    toUser,
  }: {
    functionName: string
    level: Levels
    message: string
    metadata: loggerTypes.LogMetadata
    toUser: boolean
  }) {
    if (!this.isContextSet) {
      this.logger.log({
        className: this.className,
        functionName,
        level: Levels.WARN,
        message: `The log (below) was created without a globalContext!`,
        meta: {
          logicPath: this.logicPath,
        },
        toUser: false,
      })
    }
    this.logger.log({
      className: this.className,
      functionName,
      level,
      message,
      meta: {
        ...metadata,
        logicPath: this.logicPath,
      },
      toUser,
    })
  }

  private static currentTime() {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      timeStyle: "medium",
      timeZone: "America/New_York",
    }).format(Date.now())
  }

  private initLogger(): InternalLogger {
    // Inspired from https://github.com/winstonjs/winston#filtering-info-objects
    const suppressConsole = this.loggerLib.format((info) => {
      // If in dev environment and an Error/Warning occurs, force output to
      // console for visibility
      if (
        this.isDeveloperEnv &&
        this.problemLevels.includes(info.level.toLowerCase() as Levels)
      ) {
        return info
      }
      if (info["toUser"]) {
        return info
      }
      // By returning false, we suppress the output
      return false
    })
    return this.loggerLib.createLogger({
      level: Levels.INFO,
      transports: [
        new this.loggerLib.transports.Console({
          format: this.loggerLib.format.combine(
            suppressConsole(),
            this.loggerLib.format.colorize({ colors: { error: "red" } }),
            this.loggerLib.format.errors({ stack: true }),
            this.loggerLib.format.printf((info) => `${String(info.message)}`),
          ),
          level: Levels.INFO,
          stderrLevels: this.problemLevels,
        }),
        new this.loggerLib.transports.File({
          filename: `${this.debugLogFilePath}`,
          format: this.loggerLib.format.combine(
            this.loggerLib.format.timestamp({
              format: () => Logger.currentTime(),
            }),
            this.loggerLib.format.printf(
              (info) =>
                // TODO: Suppress Errors
                `${String(info["timestamp"])} - ${this.getInvocationName({
                  functionName: info["functionName"],
                })} - ${info.level.toLocaleUpperCase()} - ${String(
                  info.message,
                )} - ${JSON.stringify(
                  info["meta"],
                  (_, v) => (typeof v === "bigint" ? v.toString() : v),
                  4,
                )}`,
            ),
          ),
          level: "silly",
        }),
      ],
    })
  }

  debug({ functionName, message, metadata, toUser = false }: Log) {
    this.createLog({
      functionName,
      level: Levels.DEBUG,
      message,
      metadata,
      toUser,
    })
    return this
  }

  error({ functionName, message, metadata, toUser = true }: Log) {
    this.createLog({
      functionName,
      level: Levels.ERROR,
      message,
      metadata,
      toUser,
    })
    return this
  }

  getInvocationName({ functionName }: { functionName: string }) {
    let invocationName: string
    if (typeof this.className === "undefined") {
      invocationName = functionName
    } else {
      invocationName = `${this.className}.${functionName}`
    }
    return invocationName
  }

  info({ functionName, message, metadata, toUser = false }: Log) {
    this.createLog({
      functionName,
      level: Levels.INFO,
      message,
      metadata,
      toUser,
    })
    return this
  }

  logInnerFinishedExecution({
    functionName,
    metadata,
  }: loggerTypes.ILoggerBaseParams) {
    this.debug({
      functionName,
      message: LogMessages.InnerFinishedExecution,
      metadata,
      toUser: false,
    })
    return this
  }

  logInnerStartExecution({
    functionName,
    metadata,
  }: loggerTypes.ILoggerBaseParams) {
    this.debug({
      functionName,
      message: LogMessages.InnerStartExecution,
      metadata,
      toUser: false,
    })
    return this
  }

  logOuterFinishedExecution({
    functionName,
    metadata,
  }: loggerTypes.ILoggerBaseParams) {
    this.debug({
      functionName,
      message: LogMessages.OuterFinishedExecution,
      metadata,
      toUser: false,
    })
    return this
  }

  logOuterStartExecution({
    functionName,
    metadata,
  }: loggerTypes.ILoggerBaseParams) {
    this.debug({
      functionName,
      message: LogMessages.OuterStartExecution,
      metadata,
      toUser: false,
    })
    return this
  }

  setGlobalContext({
    className,
    logicPath,
  }: {
    className?: string
    logicPath: string
  }) {
    if (className) {
      this.className = className
    }
    if (logicPath) {
      this.logicPath = logicPath
    }
    this.isContextSet = true
    return this
  }

  warn({ functionName, message, metadata, toUser = false }: Log) {
    this.createLog({
      functionName,
      level: Levels.WARN,
      message,
      metadata,
      toUser,
    })
    return this
  }
}
