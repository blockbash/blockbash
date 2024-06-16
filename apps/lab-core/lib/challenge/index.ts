import { createLogger, env } from "@blockbash/common-be";
import * as errorTest from "lib/challenge/test/error";
import * as ethTest from "lib/challenge/test/eth";
import * as mocha from "mocha";

import { ChallengeEnv } from "./challengeEnv";
import * as challengeEnvCost from "./challengeEnv.const";
const challengeEnv = new ChallengeEnv({
  injectedDependencies: {
    env,
    logger: createLogger(),
    testLib: mocha,
  },
});

export { challengeEnv, challengeEnvCost, errorTest, ethTest };
