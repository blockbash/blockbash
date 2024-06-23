import { tutorialConfigConst } from "@blockbash/common";
import { ListItem, chakra } from "@chakra-ui/react";
import { Link, LinkTutorial, OrderedList } from "@components";
import React from "react";

export interface HelpProps {
  tutorialGUID: tutorialConfigConst.TutorialGUID;
}

export function Help(props: HelpProps): JSX.Element {
  return (
    <OrderedList>
      <ListItem>
        Review the hints within the{" "}
        <LinkTutorial
          anchorGUID={tutorialConfigConst.AnchorGUID.labChallenges}
          tutorialGUID={props.tutorialGUID}
        />{" "}
        section.
      </ListItem>
      <ListItem>
        <chakra.span>If the hints don't help, leverage </chakra.span>
        <Link
          href={"https://github.com/blockbash/blockbash/issues/new/choose"}
          shouldOpenTab={true}
        >
          this link
        </Link>{" "}
        for further assistance.
      </ListItem>
    </OrderedList>
  );
}
