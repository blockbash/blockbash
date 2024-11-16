import { Box, type BoxProps } from "@chakra-ui/react";
import React from "react";

import { ChallengeHints, type Hint } from "./ChallengeHints";
import { ParentAccordion } from "./ParentAccordion";
import { colors } from "./challenge.const";

export interface QuestionPromptProps extends BoxProps {
  children: React.ReactElement;
  hints?: Hint[];
}

export function QuestionPrompt({
  children,
  hints,
  ...boxProps
}: QuestionPromptProps): JSX.Element {
  return (
    <>
      <Box ml={"4%"} {...boxProps}>
        {hints !== undefined && (
          <ParentAccordion buttonColor={colors.hint} title={"Hints"}>
            <ChallengeHints hints={hints} />
          </ParentAccordion>
        )}
        <ParentAccordion buttonColor={colors.answer} title={"Answer"}>
          {children}
        </ParentAccordion>
      </Box>
    </>
  );
}
