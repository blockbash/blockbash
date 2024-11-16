import {
  tutorialConfigConst,
  type tutorialConfigTypes,
} from "@blockbash/common";
import { chakra } from "@chakra-ui/react";
import { LinkTutorial, Tip } from "@components";
import React from "react";

interface CodePanelTipProcessDiagramProps {
  tutorialGUID: tutorialConfigTypes.TutorialGUID;
}

export function CodePanelTipProcessDiagram(
  props: CodePanelTipProcessDiagramProps,
): JSX.Element {
  return (
    <Tip>
      <chakra.span>
        Don't worry if the code (below) doesn't make complete sense. You'll dive
        into the details within the{" "}
        <LinkTutorial
          anchorGUID={tutorialConfigConst.AnchorGUID.processDiagram}
          tutorialGUID={props.tutorialGUID}
        />
        .
      </chakra.span>
    </Tip>
  );
}
