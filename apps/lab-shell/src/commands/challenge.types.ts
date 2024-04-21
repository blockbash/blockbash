import {
  type challengeParserTypes,
  type envTypes,
  type fileTypes,
  type loggerTypes,
  type shellTypes,
  type spinnerTypes,
  type tutorialConfigTypes,
} from "@blockbash/common-be"

import { type CreateChallengeReporter } from "../challengeReporter.types"

interface ChallengeDependencies {
  challengeParser: challengeParserTypes.ChallengeParser
  createChallengeReporter: CreateChallengeReporter
  env: envTypes.Env
  file: fileTypes.File
  filePath: fileTypes.FilePath
  logger: loggerTypes.ILogger
  shell: shellTypes.Shell
  spinner: spinnerTypes.Spinner
  tutorialConfig: tutorialConfigTypes.TutorialsConfigOrchestrator
}

export type { ChallengeDependencies }
