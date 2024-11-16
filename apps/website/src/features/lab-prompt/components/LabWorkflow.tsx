import {
  tutorialConfigConst,
  type tutorialConfigTypes,
} from "@blockbash/common";
import { Box, Code, ListItem, chakra } from "@chakra-ui/react";
import {
  Bold,
  LinkAnchor,
  LinkTutorial,
  OrderedList,
  UnorderedList,
  Warning,
} from "@src/components";
import React, { type ReactNode } from "react";

export interface LabProcessProps {
  tutorialGUID: tutorialConfigTypes.TutorialGUID;
  tutorialTypeGUID: tutorialConfigConst.TutorialTypeGUID;
  updateContractCTA: ReactNode;
}

function getPrimaryContractFileName(
  tutorialTypeGUID: tutorialConfigConst.TutorialTypeGUID,
) {
  if (tutorialTypeGUID === tutorialConfigConst.TutorialTypeGUID.attackLab) {
    return tutorialConfigConst.ContractFileName.Attacker;
  } else if (
    tutorialTypeGUID === tutorialConfigConst.TutorialTypeGUID.defendLab
  ) {
    return tutorialConfigConst.ContractFileName.Vulnerable;
  } else {
    const errorMessage = `Unexpected tutorialType:${tutorialTypeGUID}`;
    throw new Error(errorMessage);
  }
}

export function LabWorkflow({
  tutorialGUID,
  tutorialTypeGUID,
  updateContractCTA,
}: LabProcessProps): JSX.Element {
  const primaryContractFileName = getPrimaryContractFileName(tutorialTypeGUID);
  return (
    <OrderedList>
      <ListItem>
        Use the{" "}
        <LinkAnchor
          anchorGUID={tutorialConfigConst.AnchorGUID.labOptions}
        ></LinkAnchor>{" "}
        section to start the lab.
      </ListItem>
      <ListItem>
        <Bold>Optional:</Bold> If you previously worked in the lab, you'll need
        to: i) close any open tabs; ii) navigate to the lab's terminal and
        execute <Code>revert</Code>.
      </ListItem>
      <ListItem>
        Review the <Code>Vulnerable.sol</Code> and <Code>Attacker.sol</Code>{" "}
        contracts. While doing the review, start to think about how you can
        update <Code>{primaryContractFileName}</Code> to solve the{" "}
        <LinkTutorial
          anchorGUID={tutorialConfigConst.AnchorGUID.labChallenges}
          tutorialGUID={tutorialGUID}
        />
        .
      </ListItem>
      <ListItem>
        {updateContractCTA}
        <Box my={3}>
          <Warning>
            <chakra.span>
              Within <Code>{primaryContractFileName}</Code>, please make your
              changes <Bold>between</Bold> the following code comments:{" "}
              <UnorderedList>
                <ListItem>
                  <Code>// COMMENT GROUP A: START</Code>
                </ListItem>
                <ListItem>
                  <Code>// COMMENT GROUP A: END</Code>
                </ListItem>
              </UnorderedList>
              If you change other code, the lab might not work.
            </chakra.span>
          </Warning>
        </Box>
      </ListItem>
      <ListItem>
        <chakra.span>
          When you're ready to verify your solution, go to the lab environment's
          terminal and execute the <Code>cv</Code> command. (This is short for{" "}
          <Bold>C</Bold>hallenges <Bold>V</Bold>
          erify.)
        </chakra.span>
      </ListItem>
      <ListItem>
        <chakra.span>
          Behind the scenes, the <Code>cv</Code> command invokes{" "}
          <Code>Attacker.attack()</Code>.
        </chakra.span>
      </ListItem>
      <ListItem>
        <chakra.span>
          <Code>cv</Code> prints a call stack and verifies that the{" "}
          <LinkTutorial
            anchorGUID={tutorialConfigConst.AnchorGUID.labChallenges}
            tutorialGUID={tutorialGUID}
          />{" "}
          have been completed.
        </chakra.span>
      </ListItem>
    </OrderedList>
  );
}
