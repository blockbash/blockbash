import { createLogger, env } from "@blockbash/common-be"
import * as mocha from "mocha"

import { ChallengeEnv } from "./challengeEnv"
import * as challengeEnvCost from "./challengeEnv.const"
import * as testConst from "./test/test.const"
import * as ethTest from "lib/challenge/test/eth"
import * as errorTest from "lib/challenge/test/error"

const challengeEnv = new ChallengeEnv({
  injectedDependencies: {
    env,
    logger: createLogger(),
    testLib: mocha,
  },
})

export { challengeEnv, challengeEnvCost, testConst, ethTest, errorTest }
