import type { loggerTypes } from "@blockbash/common";
import type jp from "jsonpath";
import type { PlainTest, TestError } from "mochawesome";

import { ChallengeParser } from "./challengeParser";

interface ChallengeParserDependencies {
  jsonpLib: typeof jp;
  logger: loggerTypes.ILoggerMin;
}
interface RawFailedChallengeResult extends PlainTest {
  err: TestError;
}

interface ChallengeResult extends RawFailedChallengeResult {
  contexts: string[];
}
type ChallengeResults = ChallengeResult[];

type RawFailedChallengeResults = RawFailedChallengeResult[];

export {
  ChallengeParser,
  type ChallengeParserDependencies,
  type ChallengeResult,
  type ChallengeResults,
  type RawFailedChallengeResult,
  type RawFailedChallengeResults,
};
