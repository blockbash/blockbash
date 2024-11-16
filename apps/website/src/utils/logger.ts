import { loggerConst, type loggerTypes } from "@blockbash/common";
import { type LoggerDependencies } from "@src/utils/logger.types";
import {
  type ILogObj,
  type ISettingsParam,
  type Logger as LoggerLib,
} from "tslog";

class Logger implements loggerTypes.ILoggerBase {
  // We are passing a class (not an instance of a class)
  // noinspection LocalVariableNamingConventionJS
  private readonly LoggerLib: LoggerDependencies["LoggerLib"];

  private isContextSet = false;

  private logger: LoggerLib<ILogObj>;

  private readonly loggerLibSettings: ISettingsParam<ILogObj> = {
    hideLogPositionForProduction: true,
  };

  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: LoggerDependencies;
  }) {
    this.LoggerLib = injectedDependencies.LoggerLib;
    this.logger = new this.LoggerLib(this.loggerLibSettings);
  }

  private createLog({
    functionName,
    message,
    metadata,
  }: loggerTypes.ILoggerExtendableParams) {
    const log: loggerTypes.UnpackedLog[] = [];
    if (!this.isContextSet) {
      this.logger.warn(
        `Log created without leveraging ${this.setGlobalContext.name}.`,
      );
    }
    log.push(`\n\n${functionName}: ${message}`);
    if (typeof metadata !== "undefined") {
      log.push(metadata);
    }
    return log;
  }

  debug({
    functionName,
    message,
    metadata,
  }: loggerTypes.ILoggerExtendableParams): this {
    this.logger.debug(...this.createLog({ functionName, message, metadata }));
    return this;
  }

  // Used inside a function that was invoked.
  error({
    functionName,
    message,
    metadata,
  }: loggerTypes.ILoggerExtendableParams): this {
    this.logger.error(...this.createLog({ functionName, message, metadata }));
    return this;
  }

  // Used inside a function that was invoked.
  info({
    functionName,
    message,
    metadata,
  }: loggerTypes.ILoggerExtendableParams): this {
    this.logger.info(...this.createLog({ functionName, message, metadata }));
    return this;
  }

  // Helpful inside useEffect, etc.
  logInnerFinishedExecution({
    functionName,
    metadata,
  }: loggerTypes.ILoggerBaseParams): this {
    this.logger.debug(
      ...this.createLog({
        functionName,
        message: loggerConst.LogMessages.InnerFinishedExecution,
        metadata,
      }),
    );
    return this;
  }

  // Used outside a function that was invoked
  // Helpful inside useEffect, etc.
  logInnerStartExecution({
    functionName,
    metadata,
  }: loggerTypes.ILoggerBaseParams): this {
    this.logger.debug(
      ...this.createLog({
        functionName,
        message: loggerConst.LogMessages.InnerStartExecution,
        metadata,
      }),
    );
    return this;
  }

  // Logs a functions return value(s)
  logOuterFinishedExecution({
    functionName,
    metadata,
  }: loggerTypes.ILoggerBaseParams): this {
    this.logger.debug(
      ...this.createLog({
        functionName,
        message: loggerConst.LogMessages.OuterFinishedExecution,
        metadata,
      }),
    );
    return this;
  }

  // Used outside a function that is about to be invoked
  logOuterStartExecution({
    functionName,
    metadata,
  }: loggerTypes.ILoggerBaseParams): this {
    this.logger.debug(
      ...this.createLog({
        functionName,
        message: loggerConst.LogMessages.OuterStartExecution,
        metadata,
      }),
    );
    return this;
  }

  // Caller should invoke to set appropriate context
  setGlobalContext({
    className,
    logicPath,
  }: {
    className?: string;
    logicPath: string;
  }): this {
    let loggerName = "";
    if (typeof className === "undefined") {
      loggerName = `${logicPath}`;
    } else {
      loggerName = `${logicPath}:${className}`;
    }
    this.logger = new this.LoggerLib({
      ...this.loggerLibSettings,
      name: loggerName,
    });
    this.isContextSet = true;
    return this;
  }

  warn({
    functionName,
    message,
    metadata,
  }: loggerTypes.ILoggerExtendableParams): this {
    this.logger.warn(...this.createLog({ functionName, message, metadata }));
    return this;
  }
}

export { Logger };
