import { ColorProps } from "@chakra-ui/react"
import { AdmonitionWrapper } from "@src/components/admonition/AdmonitionWrapper";
import React, { type ReactNode } from "react";
import { FaRegLightbulb } from "react-icons/fa";

export interface TipProps {
  content: ReactNode;
}

export function Tip(props: TipProps): JSX.Element {
  const color: NonNullable<ColorProps["color"]> = "green.500"
  return (
    <AdmonitionWrapper
      admonitionLabel={"Tip"}
      content={props.content}
      icon={FaRegLightbulb}
      admonitionLabelColor={color}
      iconBackgroundColor={color}
    />
  );
}
