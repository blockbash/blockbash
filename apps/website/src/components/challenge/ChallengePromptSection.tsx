import { type tutorialConfigTypes } from "@blockbash/common";
import { Box, ListItem } from "@chakra-ui/react";
import React from "react";

import { OrderedList } from "../list/OrderedList";
import { ChallengeHints, type Hint } from "./ChallengeHints";
import { ChallengePrompt } from "./ChallengePrompt";
import { ParentAccordion } from "./ParentAccordion";
import { colors } from "./challenge.const";

export interface Challenge {
  additionalContent?: React.ReactElement;
  hints?: Hint[];
  id: number;
  title: tutorialConfigTypes.ChallengeDescriptions;
}
export interface ChallengePromptSectionProps {
  challenges: Challenge[];
}

export function ChallengePromptSection({
  challenges,
}: ChallengePromptSectionProps): JSX.Element {
  return (
    <OrderedList>
      {challenges.map(
        (challenge): JSX.Element => (
          <ListItem key={challenge.id}>
            <ChallengePrompt description={challenge.title} />
            {challenge.additionalContent !== undefined && (
              <Box mt={2}>{challenge.additionalContent}</Box>
            )}
            {challenge.hints !== undefined && (
              <ParentAccordion buttonColor={colors.hint} title={"Hints"}>
                <ChallengeHints hints={challenge.hints} />
              </ParentAccordion>
            )}
          </ListItem>
        ),
      )}
    </OrderedList>
  );
}
