import { ArrowLeftIcon } from "@chakra-ui/icons";
import {
  Hide,
  Highlight,
  type HighlightProps,
  ListItem,
  Stack,
  chakra,
} from "@chakra-ui/react";
import { Styles } from "@src/css";
import React, { Children, type ReactNode } from "react";

import { Tip } from "../admonition/Tip";
import { SectionWrapper } from "../layout/SectionWrapper";
import { UnorderedList } from "../list/UnorderedList";
import { Bold } from "../text/Bold";
import { CodePanel } from "./CodePanel";

interface SolutionCodePanelProps {
  children: ReactNode;
}

const sharedHighlightStylesProps: HighlightProps["styles"] = {
  px: "2",
  py: "1",
  rounded: "full",
};

/*
 * Wraps multiple CodePanels in a "side-by-side" layout
 * If you want to iterate over a group of nodes, it's recommended to pass them as a prop. However, we can't do this with mdx elements.  Thus we use Children.map
 * */
export function SolutionCodePanel({
  children,
}: SolutionCodePanelProps): JSX.Element {
  return (
    <SectionWrapper>
      <Tip>
        <UnorderedList>
          <Hide below={Styles.docusaurusDesktopThresholdWidth} ssr={true}>
            <ListItem>
              <chakra.span>
                To maximize viewing space, click the <ArrowLeftIcon /> in the
                bottom left corner
              </chakra.span>
            </ListItem>
          </Hide>
          <ListItem>
            <chakra.span>
              <Highlight
                query={"Green highlights"}
                styles={{
                  // ec classes defined by Expressive Code
                  bg: "var(--ec-tm-insBg)",
                  ...sharedHighlightStylesProps,
                }}
              >
                Green highlights
              </Highlight>
              : Code that has been <Bold>added</Bold>.
            </chakra.span>
          </ListItem>
          <ListItem>
            <chakra.span>
              <Highlight
                query={"Red highlights"}
                styles={{
                  bg: "var(--ec-tm-delBg)",
                  ...sharedHighlightStylesProps,
                }}
              >
                Red highlights
              </Highlight>
              : Code that has been <Bold>deleted</Bold>.
            </chakra.span>
          </ListItem>
        </UnorderedList>
      </Tip>
      <Stack alignItems={"flex-start"} direction={["column", "row"]}>
        {Children.map(children, (child) => (
          <CodePanel maxWidth={["100%", "50%"]}>{child}</CodePanel>
        ))}
      </Stack>
    </SectionWrapper>
  );
}
