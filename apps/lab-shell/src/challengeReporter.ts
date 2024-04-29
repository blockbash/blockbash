import {
  challengeParser,
  type challengeParserTypes,
} from "@blockbash/common-be"
import chalk from "chalk"

import { type ChallengeReporterDependencies } from "./challengeReporter.types"

export function createChallengeReporter({
  failedChallenges,
}: {
  failedChallenges: challengeParserTypes.ChallengeResults
}): ChallengeReporter {
  return new ChallengeReporter({
    failedChallenges,
    injectedDependencies: {
      chalk,
      challengeParser,
    },
  })
}

/**
 * Renders challenge results (to the user) via the CLI.
 */
class ChallengeReporter {
  private readonly chalkLib: ChallengeReporterDependencies["chalk"]

  private readonly failedChallenges: challengeParserTypes.ChallengeResults

  constructor({
    failedChallenges,
    injectedDependencies,
  }: {
    failedChallenges: challengeParserTypes.ChallengeResults
    injectedDependencies: ChallengeReporterDependencies
  })
  {
    this.failedChallenges = failedChallenges
    this.chalkLib = injectedDependencies.chalk
  }

  // noinspection FunctionWithMultipleLoopsJS
  stringifyFailedChallenges(): string {
    const stringifiedChallenges: string[] = []
    this.failedChallenges.forEach((failedChallenge) => {
      stringifiedChallenges.push(
        `✖ ${this.chalkLib.bold.red("Challenge Failure:")} User ${
          failedChallenge.title
        }`,
      )
      if (failedChallenge?.contexts?.length) {
        stringifiedChallenges.push(`  Context:`)
        failedChallenge.contexts.forEach((context) => {
          stringifiedChallenges.push(`    ${context}`)
        })
      }
    })
    return stringifiedChallenges.join("\n")
  }
}
