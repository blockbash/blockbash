import type * as mocha from "mocha"

import {
  type env,
  type envConst,
  type loggerTypes,
  type tutorialConfigConst,
} from "@blockbash/common-be"

import { type ChallengeEnv } from "./challengeEnv.const"

interface ChallengeEnvDependencies {
  env: typeof env
  logger: loggerTypes.ILogger
  testLib: typeof mocha
}

interface EnvDescribeNames {
  challengeGroupName:
    | ChallengeEnv.automationEnvGlobalGroup
    | tutorialConfigConst.TutorialName
  testSummary: string
}

interface GetDescribeOrSkip extends EnvDescribeNames {
  env: envConst.LabExecEnvGUID
}

interface EnvDescribe extends EnvDescribeNames {
  // Taken from SuiteFunction type
  fn: (this: mocha.Suite) => void
}

export type { ChallengeEnvDependencies, EnvDescribe, GetDescribeOrSkip }
