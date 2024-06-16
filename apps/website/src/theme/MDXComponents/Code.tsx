import type { WrapperProps } from "@docusaurus/types";
import type CodeType from "@theme/MDXComponents/Code";

import { Code as _Code } from "@chakra-ui/react";
import Code from "@theme-original/MDXComponents/Code";
import React from "react";
type Props = WrapperProps<typeof CodeType>;

/*
 * The skeleton for this file was created via docusaurus
 * See https://docusaurus.io/docs/swizzling#wrapping
 * */
export default function CodeWrapper(props: Props): JSX.Element {
  // Remove color prop as the types don't align.  We don't need it anyway as the color is defined by Chakra.
  const { color, ...mutatedProps } = props;
  return <_Code as={Code} {...mutatedProps}></_Code>;
}
