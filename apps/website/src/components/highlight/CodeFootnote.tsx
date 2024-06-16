import { Code, type CodeProps, chakra } from "@chakra-ui/react";
import { Bold } from "@components";
import React, { type ReactNode } from "react";

import { sharedCodeStyles } from "./highlight.const";

interface CodeFootnoteProps {
  children?: ReactNode;
  prefix?: string;
  type: "del" | "ins" | "reg";
}

function getVariantProps({
  type,
}: {
  type: CodeFootnoteProps["type"];
}): Pick<CodeProps, "background"> {
  switch (type) {
    case "del":
      return {
        /* --ec-tm-delBrdCol: Defined by Expressive Code and correspond to red footnotes */
        background: "var(--ec-tm-delBrdCol)",
      };
    case "ins":
      return { background: "var(--ec-tm-insBrdCol)" };
    case "reg":
      return { background: "var(--ec-tm-markBrdCol)" };
  }
}

/* Used for explaining footnotes in mdx `code` blocks */
export function CodeFootnote({
  children,
  prefix = "Marker",
  type = "reg",
}: CodeFootnoteProps): JSX.Element {
  const variantProps = getVariantProps({ type });
  return (
    <chakra.span>
      {prefix !== "" && <Bold>{prefix} </Bold>}
      <Code {...sharedCodeStyles} {...variantProps}>
        {children}
      </Code>
    </chakra.span>
  );
}
