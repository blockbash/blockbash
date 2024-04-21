import { loggerConst } from "@blockbash/common"

const { LogMessages } = loggerConst

enum Levels {
  DEBUG = "debug",
  ERROR = "error",
  HTTP = "http",
  INFO = "info",
  SILLY = "silly",
  VERBOSE = "verbose",
  WARN = "warn",
}

export { Levels, LogMessages }
