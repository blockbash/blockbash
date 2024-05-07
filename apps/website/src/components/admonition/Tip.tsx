import { AdmonitionWrapper } from "@src/components/admonition/AdmonitionWrapper";
import React, { type ReactNode } from "react";
import { FaRegLightbulb } from "react-icons/fa";

export interface TipProps {
  content: ReactNode;
}

export function Tip(props: TipProps): JSX.Element {
  return (
    <AdmonitionWrapper
      admonitionLabel={"Tip"}
      content={props.content}
      icon={FaRegLightbulb}
      iconBackgroundColor={"green.500"}
    />
  );
}
