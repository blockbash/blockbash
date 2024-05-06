import { Admonition } from "@src/components/admonition/Admonition";
import React, { type ReactNode } from "react";
import { IoMdAlert } from "react-icons/io";

export interface InfoProps {
  content: ReactNode;
}

export function Info(props: InfoProps): JSX.Element {
  return (
    <Admonition
      admonitionLabel={"Info"}
      content={props.content}
      icon={IoMdAlert}
      iconBackgroundColor={"blue.500"}
    />
  );
}
