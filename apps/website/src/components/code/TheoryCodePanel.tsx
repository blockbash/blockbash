import {
  tutorialConfigConst,
  type tutorialConfigTypes,
} from "@blockbash/common";
import { chakra } from "@chakra-ui/react";
import { LinkTutorial, SectionWrapper, Tip } from "@components";
import React, { type ReactNode } from "react";

import { CodePanel } from "./CodePanel";

interface TheoryCodeSectionWrapperProps {
  children: ReactNode;
  tutorialGUID: tutorialConfigTypes.TutorialGUID;
}

export function TheoryCodePanel(
  props: TheoryCodeSectionWrapperProps,
): JSX.Element {
  return (
    <>
      <SectionWrapper>
        <Tip>
          <chakra.span>
            Don't worry if the code (below) doesn't make complete sense. You'll
            dive into the details within the{" "}
            <LinkTutorial
              anchorGUID={tutorialConfigConst.AnchorGUID.processDiagram}
              tutorialGUID={props.tutorialGUID}
            />.
          </chakra.span>
        </Tip>
        <CodePanel>{props.children}</CodePanel>
      </SectionWrapper>
    </>
  );
}
