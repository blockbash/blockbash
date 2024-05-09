import { ColorProps } from "@chakra-ui/react"
import { AdmonitionWrapper } from "@src/components/admonition/AdmonitionWrapper";
import React, { type ReactNode } from "react";
import { IoMdAlert } from "react-icons/io";

export interface InfoProps {
  content: ReactNode;
}

export function Info(props: InfoProps): JSX.Element {
  const color: NonNullable<ColorProps["color"]> = "blue.500"
  return (
    <AdmonitionWrapper
      admonitionLabel={"Info"}
      content={props.content}
      icon={IoMdAlert}
      admonitionLabelColor={color}
      iconBackgroundColor={color}
    />
  );
}
