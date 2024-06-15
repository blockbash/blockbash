import { type tutorialConfigTypes } from "@blockbash/common";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  type ButtonProps,
  ListItem,
  chakra,
} from "@chakra-ui/react";
import { Styles } from "@src/css";
import React from "react";

import { OrderedList } from "../list/OrderedList";
import { ChallengeHints, type Hint } from "./ChallengeHints";
import { ChallengePrompt } from "./ChallengePrompt";
import {
  accordionItemBaseStyles,
  accordionPanelBaseStyles,
} from "./challenge.const";

export interface Challenge {
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
  const buttonBackgroundColor: ButtonProps["backgroundColor"] =
    Styles.warningMaximum;
  return (
    <OrderedList>
      {challenges.map(
        (challenge): JSX.Element => (
          <ListItem key={challenge.id}>
            <ChallengePrompt description={challenge.title} />
            {challenge.hints !== undefined && (
              <Accordion allowMultiple my={3}>
                <AccordionItem {...accordionItemBaseStyles}>
                  <AccordionButton
                    _expanded={{ bg: buttonBackgroundColor }}
                    _hover={{ bg: buttonBackgroundColor }}
                    as={"button"}
                    backgroundColor={buttonBackgroundColor}
                    border={"none"}
                  >
                    <chakra.span flex="1" textAlign="left">
                      Hints
                    </chakra.span>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel
                    borderColor={Styles.borderColorMin}
                    {...accordionPanelBaseStyles}
                  >
                    <ChallengeHints hints={challenge.hints} />
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            )}
          </ListItem>
        ),
      )}
    </OrderedList>
  );
}
