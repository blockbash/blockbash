import type Mochawesome from "mochawesome"

import type {
  tutorialConfigTypes
} from "@blockbash/common/src/tutorial-configs"

import type {
  ChallengeParserDependencies,
  ChallengeResults,
  RawFailedChallengeResults
} from "./challengeParser.types"
import type { challengeParserTypes } from "./index"

/**
 * Extracts the challenge results from a test runner (e.g., mocha)
 */
export class ChallengeParser {
  private static readonly challengeContextEndDelimiter = "BLOCKBASH_CONTEXT_END"

  private static readonly challengeContextStartDelimiter =
    "BLOCKBASH_CONTEXT_START"

  private readonly jsonpLib: ChallengeParserDependencies["jsonpLib"]

  private readonly logger: ChallengeParserDependencies["logger"]

  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: ChallengeParserDependencies
  }) {
    this.logger = injectedDependencies.logger
    this.jsonpLib = injectedDependencies.jsonpLib
    this.logger.setGlobalContext({
      className: ChallengeParser.name,
      logicPath: __filename,
    })
  }

  private base64Decode({ text }: { text: string }) {
    return Buffer.from(text, "base64").toString("ascii")
  }

  private base64Encode({ text }: { text: string }) {
    return Buffer.from(text).toString("base64")
  }

  private extractRawFailedChallenges({ json }: { json: Mochawesome.Output }) {
    return this.jsonpLib.query(
      json,
      `$..tests[?(@.err.message.indexOf('${ChallengeParser.challengeContextStartDelimiter}') >= 0 && @.err.message.indexOf('${ChallengeParser.challengeContextEndDelimiter}') >= 0)]`,
    ) as RawFailedChallengeResults
  }

  private getDeserializedArrayOfStrings({ input }: { input: string }) {
    return JSON.parse(input) as string[]
  }

  private getSerializedArrayOfStrings({ inputs }: { inputs: string[] }) {
    return JSON.stringify(inputs)
  }

  private normalizeChallengeResults({
    rawFailedChallenges,
  }: {
    rawFailedChallenges: challengeParserTypes.RawFailedChallengeResults
  }): ChallengeResults {
    return rawFailedChallenges.map((rawFailedChallenge) => ({
      ...rawFailedChallenge,
      contexts: this.extractContexts({
        text: rawFailedChallenge.err.message,
      }),
    }))
  }

  applyTextReplacements({
    testRunnerStdout,
    textReplacements,
  }: {
    testRunnerStdout: string
    textReplacements: tutorialConfigTypes.ChallengeTextReplacements
  }) {
    let mutatedOutput = testRunnerStdout
    if (typeof textReplacements === "undefined") {
      return mutatedOutput
    }
    for (const { matchRegex, replaceWithText } of textReplacements) {
      mutatedOutput = mutatedOutput.replaceAll(
        new RegExp(matchRegex, "gm"),
        replaceWithText,
      )
    }
    return mutatedOutput
  }

  createChallengeContexts({ contexts }: { contexts: string[] }) {
    const serializedContexts = this.getSerializedArrayOfStrings({
      inputs: contexts,
    })
    const baseEncodedContexts = this.base64Encode({
      text: serializedContexts,
    })
    const result = `${ChallengeParser.challengeContextStartDelimiter}${baseEncodedContexts}${ChallengeParser.challengeContextEndDelimiter}`
    this.logger.debug({
      functionName: this.createChallengeContexts.name,
      message: "Generated contexts",
      metadata: {
        result,
        serializedContexts,
      },
    })
    return result
  }

  extractContexts({ text }: { text: string }) {
    const regexGroup = "challengeResultContexts"
    const match = text.match(
      new RegExp(
        `${ChallengeParser.challengeContextStartDelimiter}(?<${regexGroup}>(.*))${ChallengeParser.challengeContextEndDelimiter}`,
      ),
    )
    const encodedContexts = match?.groups?.[regexGroup]
    let decodedContexts: string[] | undefined
    if (encodedContexts) {
      const decoded = this.base64Decode({
        text: encodedContexts,
      })
      decodedContexts = this.getDeserializedArrayOfStrings({
        input: decoded,
      })
    }
    const sharedLoggerArgs = {
      functionName: this.extractContexts.name,
      metadata: {
        decodedContexts: String(decodedContexts),
        encodedContexts,
        match,
        text,
      },
    }
    if (!decodedContexts) {
      const err = "Failed to parse challenge context"
      this.logger.error({
        ...sharedLoggerArgs,
        message: err,
      })
      throw new Error(err)
    }
    this.logger.logInnerFinishedExecution({
      ...sharedLoggerArgs,
    })
    return decodedContexts
  }

  getFailedChallenges({ json }: { json: Mochawesome.Output }) {
    const rawFailedChallenges = this.extractRawFailedChallenges({ json })
    const normalizedChallenges = this.normalizeChallengeResults({
      rawFailedChallenges,
    })
    this.logger.logInnerFinishedExecution({
      functionName: this.getFailedChallenges.name,
      metadata: {
        json,
        normalizedChallenges,
        rawFailedChallenges,
      },
    })
    return normalizedChallenges
  }
}
