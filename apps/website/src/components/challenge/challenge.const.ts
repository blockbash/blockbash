import {
  type AccordionButtonProps,
  type AccordionItemProps,
  type AccordionPanelProps,
  type ButtonProps,
} from "@chakra-ui/react";
type ColorNamespace = "answer" | "hint";
export const colors: Record<
  ColorNamespace,
  NonNullable<ButtonProps["backgroundColor"]>
> = {
  answer: "red.100",
  hint: "gray.100",
};

export const accordionItemBaseStyles: AccordionItemProps = {
  backgroundColor: "gray.50",
  boxShadow: "md",
};

export const accordionButtonBaseStyles: AccordionButtonProps = {
  as: "button",
  border: "none",
};

export const accordionIconBaseStyles: AccordionItemProps = {
  ml: 2,
};

export const accordionPanelBaseStyles: AccordionPanelProps = {
  borderTopStyle: "solid",
  borderTopWidth: "1px",
};
