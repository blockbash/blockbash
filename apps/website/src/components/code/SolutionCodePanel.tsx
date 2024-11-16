import { Stack } from "@chakra-ui/react";
import React, { Children } from "react";

import { CodePanelBase } from "../code/CodePanelBase";

interface SolutionCodePanelProps {
  children: React.ReactElement;
}

/*
 * Wraps multiple CodePanels in a "side-by-side" layout
 * If you want to iterate over a group of nodes, it's recommended to pass them as a prop. However, we can't do this with mdx elements.  Thus we use Children.map
 * */
export function SolutionCodePanel({
  children,
}: SolutionCodePanelProps): JSX.Element {
  return (
    <Stack alignItems={"flex-start"} direction={["column", "row"]}>
      {Children.map(children, (child) => (
        <CodePanelBase maxWidth={["100%", "50%"]}>{child}</CodePanelBase>
      ))}
    </Stack>
  );
}
