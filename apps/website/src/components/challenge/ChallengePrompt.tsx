import { type tutorialConfigTypes } from "@blockbash/common";
import { chakra } from "@chakra-ui/react";
import React from "react";

export interface ChallengePromptProps {
  description: tutorialConfigTypes.ChallengeDescriptions;
}

export function ChallengePrompt({
  description,
}: ChallengePromptProps): JSX.Element {
  return <chakra.span>Solution {description}</chakra.span>;
}
