import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  type ButtonProps,
  chakra,
} from "@chakra-ui/react";
import { Styles } from "@src/css";
import React, { type ReactNode } from "react";

import {
  accordionItemBaseStyles,
  accordionPanelBaseStyles,
} from "./challenge.const";

export interface Hint {
  content: ReactNode;
  id: number;
  title: ReactNode;
}

export interface ChallengeHintsProps {
  hints: Hint[];
}

export function ChallengeHints({ hints }: ChallengeHintsProps): JSX.Element {
  const buttonBackgroundColor: ButtonProps["backgroundColor"] =
    Styles.warningMedium;

  return (
    <Accordion allowMultiple>
      {hints.map((hint) => {
        return (
          <AccordionItem
            {...accordionItemBaseStyles}
            key={hint.id}
            mx={2}
            my={4}
          >
            <AccordionButton
              _expanded={{ bg: buttonBackgroundColor }}
              _hover={{ bg: buttonBackgroundColor }}
              as={"button"}
              backgroundColor={buttonBackgroundColor}
              border={"none"}
            >
              <chakra.span flex="1" textAlign="left">
                {hint.title}
              </chakra.span>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel
              {...accordionPanelBaseStyles}
              bg={Styles.warningMinimum}
              borderColor={Styles.borderColorMed}
              p={2}
              paddingLeft={4}
            >
              {hint.content}
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
