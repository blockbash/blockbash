import type Fuse from "fuse.js"

import { type loggerTypes } from "@blockbash/common"

interface DataDependencies {
  fuzzySearchLib: typeof Fuse<string>
  logger: loggerTypes.ILoggerBase
}

interface FuzzyResult {
  fuzzyRanking: number
  isFuzzyMatch: boolean
}

export type { DataDependencies, FuzzyResult }
