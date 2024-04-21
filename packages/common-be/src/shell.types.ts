import type shell from "shelljs"

import type { loggerTypes } from "."
import type { Shell } from "./shell"

interface ShellDependencies {
  isDeveloperEnv: boolean
  logger: loggerTypes.ILogger
  shellLib: typeof shell
}

export { Shell, type ShellDependencies }
