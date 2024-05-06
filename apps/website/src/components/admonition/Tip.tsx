import { Admonition } from "@src/components/admonition/Admonition";
import React, { type ReactNode } from "react";
import { FaRegLightbulb } from "react-icons/fa";

export interface TipProps {
  content: ReactNode;
}

export function Tip(props: TipProps): JSX.Element {
  return (
    <Admonition
      admonitionLabel={"Tip"}
      content={props.content}
      icon={FaRegLightbulb}
      iconBackgroundColor={"green.500"}
    />
  );
}
