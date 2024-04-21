import { createLogger, env } from "@blockbash/common-be"
import * as mocha from "mocha"

import { ChallengeEnv } from "./challengeEnv"
import * as challengeEnvCost from "./challengeEnv.const"
import * as reentrancyFundamentals from "./reentrancyFundamentals"

const challengeEnv = new ChallengeEnv({
  injectedDependencies: {
    env,
    logger: createLogger(),
    testLib: mocha,
  },
})

export { challengeEnv, challengeEnvCost, reentrancyFundamentals }
