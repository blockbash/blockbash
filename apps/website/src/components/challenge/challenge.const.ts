import {
  type AccordionItemProps,
  type AccordionPanelProps,
} from "@chakra-ui/react";
export const accordionItemBaseStyles: AccordionItemProps = {
  backgroundColor: "gray.100",
  borderRadius: "2xl",
  boxShadow: "sm",
  overflow: "hidden",
};

export const accordionPanelBaseStyles: AccordionPanelProps = {
  borderBottomRadius: "2xl",
  borderStyle: "solid",
  borderWidth: "1px",
  p: 1,
};
