// Expressive Code has an open feature for creating multiple editor tabs
// https://github.com/expressive-code/expressive-code/issues/22
import { Box, type BoxProps } from "@chakra-ui/react";
import { expressiveCode, expressiveCodeThemes } from "@site/docusaurus.const";
import React from "react";

interface CodePanelProps {
  children: React.ReactNode;
  className?: BoxProps["className"];
  maxHeight?: BoxProps["maxHeight"];
  maxWidth?: BoxProps["maxWidth"];
  themeName?: expressiveCodeThemes;
}
/* CodePanel wraps the "code" mdx element. */
export function CodePanel({
  children,
  maxHeight = "fit-content",
  maxWidth = "fit-content",
  themeName = expressiveCodeThemes.githubLight,
}: CodePanelProps): JSX.Element {
  return (
    <Box
      className={`expressive-code ${expressiveCode.themeSelectorPrefix}${themeName}`}
      maxH={maxHeight}
      maxW={maxWidth}
    >
      <>{children}</>
    </Box>
  );
}
