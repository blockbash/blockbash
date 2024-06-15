import {
  type tutorialConfigConst,
  type tutorialConfigTypes,
} from "@blockbash/common";
import { chakra } from "@chakra-ui/react";
import { useDependencies } from "@hooks";
import React from "react";

import { Link } from "./Link";

export interface LinkTutorialProps {
  content?: string;
  sectionGUID?: tutorialConfigConst.TutorialSectionGUID;
  tutorialGUID: tutorialConfigTypes.TutorialGUID;
}

/**
 * Allows in-line components (e.g., text) to be linkable by passing in
 * tutorialGUID. If you need to link a full component, see LinkWrapper
 * component.
 */
export function LinkTutorial({
  content,
  sectionGUID,
  tutorialGUID,
}: LinkTutorialProps): JSX.Element {
  const deps = useDependencies();
  const tutorial = deps.tutorialConfig.getTutorial(tutorialGUID);
  const href =
    sectionGUID === undefined
      ? `${tutorial.url}`
      : `${tutorial.url}${sectionGUID}`;

  return (
    /* shouldOpenTab: Must be false or you cant navigate to anchors */
    <Link href={href} shouldOpenTab={false}>
      <chakra.span>{content ?? tutorial.name}</chakra.span>
    </Link>
  );
}
