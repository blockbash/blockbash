import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  type ButtonProps,
  Flex,
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

export interface ParentAccordionProps {
  buttonColor: NonNullable<ButtonProps["backgroundColor"]>;
  children: React.ReactElement;
  title: string;
}

export function ParentAccordion({
  buttonColor,
  children,
  title,
}: ParentAccordionProps): JSX.Element {
  return (
    <>
      <Flex>
        <Accordion
          allowMultiple
          border={"1px"}
          borderColor={Styles.borderColorMax}
          borderRadius={"2xl"}
          boxShadow={"md"}
          my={2}
          overflow={"hidden"}
        >
          <AccordionItem {...accordionItemBaseStyles}>
            <AccordionButton
              _expanded={{ bg: buttonColor }}
              _hover={{ bg: buttonColor }}
              backgroundColor={buttonColor}
              {...accordionButtonBaseStyles}
            >
              <chakra.span flex="1" fontWeight={"normal"} textAlign="left">
                {title}
              </chakra.span>
              <AccordionIcon {...accordionIconBaseStyles} />
            </AccordionButton>
            <AccordionPanel
              borderColor={Styles.borderColorMed}
              {...accordionPanelBaseStyles}
            >
              {children}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    </>
  );
}
