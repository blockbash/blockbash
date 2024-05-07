import { AdmonitionWrapper } from "@src/components/admonition/AdmonitionWrapper";
import React, { type ReactNode } from "react";
import { IoMdCheckmarkCircle } from "react-icons/io";

export interface SuccessProps {
  content: ReactNode;
}

export function Success(props: SuccessProps): JSX.Element {
  return (
    <AdmonitionWrapper
      admonitionLabel={"Success"}
      content={props.content}
      icon={IoMdCheckmarkCircle}
      iconBackgroundColor={"green.500"}
    />
  );
}
