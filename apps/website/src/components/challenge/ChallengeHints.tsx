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
import React from "react";

import {
  accordionButtonBaseStyles,
  accordionIconBaseStyles,
  accordionItemBaseStyles,
  accordionPanelBaseStyles,
} from "./challenge.const";

export interface Hint {
  content: React.ReactElement;
  id: number;
  title: React.ReactElement;
}

export interface ChallengeHintsProps {
  hints: Hint[];
}

export function ChallengeHints({ hints }: ChallengeHintsProps): JSX.Element {
  const buttonBackgroundColor: ButtonProps["backgroundColor"] = "white";

  return (
    <Accordion allowMultiple>
      {hints.map((hint): JSX.Element => {
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
              backgroundColor={buttonBackgroundColor}
              {...accordionButtonBaseStyles}
            >
              <chakra.span flex="1" textAlign="left">
                {hint.title}
              </chakra.span>
              <AccordionIcon {...accordionIconBaseStyles} />
            </AccordionButton>
            <AccordionPanel
              {...accordionPanelBaseStyles}
              bg={"white"}
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
