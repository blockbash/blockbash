import { envConst } from "@blockbash/common-be"

import {
  type ChallengeEnvDependencies,
  type EnvDescribe,
  type GetDescribeOrSkip,
} from "./challengeEnv.types"

class ChallengeEnv {
  private readonly env: ChallengeEnvDependencies["env"]

  private readonly logger: ChallengeEnvDependencies["logger"]

  private readonly testLib: ChallengeEnvDependencies["testLib"]

  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: ChallengeEnvDependencies
  }) {
    this.testLib = injectedDependencies.testLib
    this.env = injectedDependencies.env
    this.logger = injectedDependencies.logger
    this.logger.setGlobalContext({
      className: ChallengeEnv.name,
      logicPath: __filename,
    })
  }

  private getDescribeOrSkip({
    challengeGroupName,
    env,
    testSummary,
  }: GetDescribeOrSkip): Mocha.PendingSuiteFunction | Mocha.SuiteFunction {
    const { currentLabExecEnv } = this.env
    const loggerArgs = {
      functionName: this.getDescribeOrSkip.name,
      metadata: {
        challengeGroupName,
        currentLabExecEnv,
        env,
        testSummary,
      },
    }
    if (!this.env.isValidLabExecEnv) {
      const err = "No lab execution environment variable defined"
      this.logger.error({
        ...loggerArgs,
        message: err,
      })
      throw new Error(err)
    }
    if (currentLabExecEnv === env) {
      this.logger.debug({
        ...loggerArgs,
        message: "Initialized describe() for challenges",
      })
      return this.testLib.describe
    }
    this.logger.debug({
      ...loggerArgs,
      message: "Initialized describe.skip() for challenges",
    })
    return this.testLib.describe.skip
  }

  public getAutomationEnvDescribe({
    challengeGroupName,
    fn,
    testSummary,
  }: EnvDescribe): Mocha.Suite | void {
    const env = envConst.LabExecEnvGUID.automation
    const envDescribe = this.getDescribeOrSkip({
      challengeGroupName,
      env,
      testSummary,
    })

    return envDescribe(`${env} environment`, fn)
  }

  public getUserEnvDescribe({
    challengeGroupName,
    fn,
    testSummary,
  }: EnvDescribe): Mocha.Suite | void {
    const env = envConst.LabExecEnvGUID.user
    const envDescribe = this.getDescribeOrSkip({
      challengeGroupName,
      env,
      testSummary,
    })

    return envDescribe(`${env} environment`, fn)
  }
}

export { ChallengeEnv }
