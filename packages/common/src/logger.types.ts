import { type loggerTypes } from "./index";

type LogMetadata = Record<string, any> | undefined;
type LogMessage = string;
type UnpackedLog = LogMessage | LogMetadata;

interface ILoggerBaseParams {
  functionName: string;
  metadata?: LogMetadata;
}

// Log properties that are leveraged in all loggers
interface ILoggerBase {
  logInnerFinishedExecution: ({
    functionName,
    metadata,
  }: ILoggerBaseParams) => this;
  logInnerStartExecution: ({
    functionName,
    metadata,
  }: ILoggerBaseParams) => this;
  logOuterFinishedExecution: ({
    functionName,
    metadata,
  }: ILoggerBaseParams) => this;
  logOuterStartExecution: ({
    functionName,
    metadata,
  }: ILoggerBaseParams) => this;

  setGlobalContext: ({
    className,
    logicPath,
  }: {
    className?: string;
    logicPath: string;
  }) => this;
}

interface ILoggerExtendableParams extends ILoggerBaseParams {
  message: LogMessage;
}

// Log properties that are in all loggers, however, individual
// loggers can add extend the method definitions with custom arguments
interface ILoggerExtendable {
  debug: ({
    functionName,
    message,
    metadata,
  }: loggerTypes.ILoggerExtendableParams) => this;
  error: ({
    functionName,
    message,
    metadata,
  }: loggerTypes.ILoggerExtendableParams) => this;
  info: ({
    functionName,
    message,
    metadata,
  }: loggerTypes.ILoggerExtendableParams) => this;
  warn: ({
    functionName,
    message,
    metadata,
  }: loggerTypes.ILoggerExtendableParams) => this;
}

// The mandatory properties for a logger
// Is the only type that should be used for code within @blockbash/common
type ILoggerMin = ILoggerBase & ILoggerExtendable;

export type {
  ILoggerBase,
  ILoggerBaseParams,
  ILoggerExtendableParams,
  ILoggerMin,
  LogMetadata,
  UnpackedLog,
};
