import { Code } from "@chakra-ui/react";
import { Bold } from "@components";
import React, { type ReactNode } from "react";

import { sharedCodeStyles } from "./highlight.const";

interface DiagramFootnoteProps {
  children: ReactNode;
  prefix?: string;
}

/* Used for explaining footnotes in diagrams */
export function DiagramFootnote(props: DiagramFootnoteProps): JSX.Element {
  return (
    <>
      {props.prefix !== undefined && <Bold>{props.prefix} - </Bold>}
      <Code background={"yellow.200"} color={"black"} {...sharedCodeStyles}>
        {props.children}
      </Code>
    </>
  );
}
