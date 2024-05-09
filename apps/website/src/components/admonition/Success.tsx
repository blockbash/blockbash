import { ColorProps } from "@chakra-ui/react"
import { AdmonitionWrapper } from "@src/components/admonition/AdmonitionWrapper";
import React, { type ReactNode } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";

export interface SuccessProps {
  content: ReactNode;
}

export function Success(props: SuccessProps): JSX.Element {
  const color: NonNullable<ColorProps["color"]> = "green.500"
  return (
    <AdmonitionWrapper
      admonitionLabel={"Success"}
      content={props.content}
      icon={IoMdCheckmarkCircle}
      admonitionLabelColor={color}
      iconBackgroundColor={color}
    />
  );
}
