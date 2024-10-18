// Expressive Code has an open feature for creating multiple editor tabs
// https://github.com/expressive-code/expressive-code/issues/22
import { Box, type BoxProps } from "@chakra-ui/react";
import { expressiveCode, expressiveCodeThemes } from "@site/docusaurus.const";
import { type ClassNames } from "@src/css";
import React from "react";

interface CodePanelBaseProps {
  children: React.ReactElement;
  maxHeight?: BoxProps["maxHeight"];
  maxWidth?: BoxProps["maxWidth"];
  prependClassName?: ClassNames;
  themeName?: expressiveCodeThemes;
}
/* CodePanel wraps the "code" mdx element. */
export function CodePanelBase({
  children,
  maxHeight = "fit-content",
  maxWidth = "fit-content",
  prependClassName,
  themeName = expressiveCodeThemes.githubLight,
}: CodePanelBaseProps): JSX.Element {
  let className = `expressive-code ${expressiveCode.themeSelectorPrefix}${themeName}`;

  if (prependClassName !== undefined) {
    className = `${prependClassName} ${className}`;
  }

  return (
    <Box className={className} maxH={maxHeight} maxW={maxWidth} mx={"auto"}>
      <>{children}</>
    </Box>
  );
}
