import { tutorialConfigConst } from "@blockbash/common";
import { Box, ListItem, chakra } from "@chakra-ui/react";
import { Bold, Header, LinkTutorial, OrderedList, Warning } from "@components";
import { Styles } from "@src/css";
import React from "react";

export interface LabPreStartProps {
  tutorialGUID: tutorialConfigConst.TutorialGUID;
}

export function LabPreStart(props: LabPreStartProps): JSX.Element {
  return (
    <Box
      backgroundColor={Styles.whiteBackgroundEmphasisColor}
      boxShadow={Styles.boxShadowMin}
      maxWidth={"xl"}
      ml={5}
      mt={0.5}
      p={5}
      rounded={"2xl"}
    >
      <Header
        anchorGUID={tutorialConfigConst.AnchorGUID.initExperimentLab}
        level={3}
      />
      <OrderedList>
        <ListItem>
          Navigate to the{" "}
          <LinkTutorial
            anchorGUID={tutorialConfigConst.AnchorGUID.labOptions}
            tutorialGUID={props.tutorialGUID}
          />{" "}
          section.
        </ListItem>
        <ListItem>
          Select the environment that's right for you:{" "}
          <Bold>Github Codespace</Bold> (recommended) or{" "}
          <Bold>Visual Studio Code</Bold>.
        </ListItem>
        <ListItem>
          In the{" "}
          <LinkTutorial
            anchorGUID={tutorialConfigConst.AnchorGUID.labOptionsNextSteps}
            tutorialGUID={props.tutorialGUID}
          />{" "}
          section, <Bold>only</Bold> complete <Bold>Step 1</Bold> (Initialize
          Lab).
          <Box mt={3}>
            <Warning labelOverride={"Important"}>
              <chakra.span>Please do NOT complete any other steps.</chakra.span>
            </Warning>
          </Box>
        </ListItem>
      </OrderedList>
    </Box>
  );
}
