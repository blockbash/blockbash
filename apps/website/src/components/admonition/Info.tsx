import { AdmonitionWrapper } from "@src/components/admonition/AdmonitionWrapper";
import React, { type ReactNode } from "react";
import { IoMdAlert } from "react-icons/io";

export interface InfoProps {
  content: ReactNode;
}

export function Info(props: InfoProps): JSX.Element {
  return (
    <AdmonitionWrapper
      admonitionLabel={"Info"}
      content={props.content}
      icon={IoMdAlert}
      iconBackgroundColor={"blue.500"}
    />
  );
}
