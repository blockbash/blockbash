import { ArrowLeftIcon } from "@chakra-ui/icons";
import {
  Hide,
  Highlight,
  type HighlightProps,
  ListItem,
  chakra,
} from "@chakra-ui/react";
import { Bold, Tip, UnorderedList } from "@components";
import { Styles } from "@src/css";
import React from "react";

const sharedHighlightStylesProps: HighlightProps["styles"] = {
  px: "2",
  py: "1",
  rounded: "full",
};

interface CodePanelSolutionTipProps {
  showHighlightInstructions?: boolean;
  showMaximizeInstruction?: boolean;
}

export function CodePanelSolutionTip({
  showHighlightInstructions = false,
  showMaximizeInstruction = false,
}: CodePanelSolutionTipProps): JSX.Element {
  return (
    <Tip isFlattened={false}>
      <UnorderedList>
        {showMaximizeInstruction && (
          <ListItem>
            <chakra.span>
              To maximize viewing space, click the <ArrowLeftIcon /> icon within
              the bottom left corner
            </chakra.span>
          </ListItem>
        )}

        {showHighlightInstructions && (
          <>
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
                : Correspond to <Bold>additions</Bold>.
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
                : Correspond to <Bold>removals</Bold>.
              </chakra.span>
            </ListItem>
          </>
        )}
      </UnorderedList>
    </Tip>
  );
}
