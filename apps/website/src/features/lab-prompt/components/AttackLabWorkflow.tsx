import {
  tutorialConfigConst,
  type tutorialConfigTypes,
} from "@blockbash/common";
import { Box, Code, ListItem, chakra } from "@chakra-ui/react";
import {
  Bold,
  LinkTutorial,
  OrderedList,
  UnorderedList,
  Warning,
} from "@src/components";
import React, { type ReactNode } from "react";

export interface AttackLabProcessProps {
  tutorialGUID: tutorialConfigTypes.TutorialGUID;
  updateAttackerContractCTA: ReactNode;
}

export function AttackLabWorkflow({
  tutorialGUID,
  updateAttackerContractCTA,
}: AttackLabProcessProps): JSX.Element {
  return (
    <OrderedList>
      <ListItem>
        After the lab has been created, review the <Code>Vulnerable.sol</Code>{" "}
        and <Code>Attacker.sol</Code> contracts. (These contracts are available
        within the lab environment.) While doing the review, start to think
        about how you can update the <Code>Attacker</Code> contract to solve the{" "}
        <LinkTutorial
          content={tutorialConfigConst.TutorialSectionName.labChallenges}
          sectionGUID={tutorialConfigConst.TutorialSectionGUID.labChallenges}
          tutorialGUID={tutorialGUID}
        />
        .
      </ListItem>
      <ListItem>
        {updateAttackerContractCTA}
        <Box my={3}>
          <Warning>
            <chakra.span>
              Only add your logic <Bold>between</Bold> the following code
              comments:{" "}
              <UnorderedList>
                <ListItem>
                  <Code>// INSERT LOGIC HERE: START</Code>
                </ListItem>
                <ListItem>
                  <Code>// INSERT LOGIC HERE: END</Code>
                </ListItem>
              </UnorderedList>
              If you add code to other locations, the lab might not work.
            </chakra.span>
          </Warning>
        </Box>
      </ListItem>
      <ListItem>
        <chakra.span>
          When you're ready to verify your solution, go to the lab environment's
          terminal and execute the <Code>cv</Code> command. (This is short for{" "}
          <Bold>C</Bold>hallenge <Bold>V</Bold>
          erify.)
        </chakra.span>
      </ListItem>
      <ListItem>
        <chakra.span>
          Behind the scenes, <Code>cv</Code> triggers your exploit by calling{" "}
          <Code>Attacker.attack()</Code>.
        </chakra.span>
      </ListItem>
      <ListItem>
        <chakra.span>
          <Code>cv</Code> prints a call stack and verifies that the{" "}
          <LinkTutorial
            content={tutorialConfigConst.TutorialSectionName.labChallenges}
            sectionGUID={tutorialConfigConst.TutorialSectionGUID.labChallenges}
            tutorialGUID={tutorialGUID}
          />{" "}
          have been completed.
        </chakra.span>
      </ListItem>
    </OrderedList>
  );
}
