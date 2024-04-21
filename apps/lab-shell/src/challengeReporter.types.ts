import type chalk from "chalk"

import { type challengeParserTypes } from "@blockbash/common-be"

import { type createChallengeReporter } from "./challengeReporter"

interface ChallengeReporterDependencies {
  chalk: typeof chalk
  challengeParser: challengeParserTypes.ChallengeParser
}
type CreateChallengeReporter = typeof createChallengeReporter

export type { ChallengeReporterDependencies, CreateChallengeReporter }
