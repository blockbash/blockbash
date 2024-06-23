import {
  tutorialConfigConst,
  type tutorialConfigTypes,
} from "@blockbash/common";
import { useDependencies } from "@hooks";
import { navigation } from "@utils";
import React from "react";

import { Link } from "./Link";

export interface LinkTutorialProps {
  anchorGUID?: tutorialConfigTypes.AnchorGUID;
  content?: string;
  shouldOpenTab?: boolean;
  tutorialGUID: tutorialConfigTypes.TutorialGUID;
}

/**
 * Inline component for linking to another tutorial page
 * For linking within a tutorial, see AnchorLink
 * Link text will be populated by the first value that is defined: content ->
 * anchorGUID (fetches anchorName) -> tutorialGUID (fetches tutorialName)
 */
export function LinkTutorial({
  anchorGUID,
  content,
  shouldOpenTab = false,
  tutorialGUID,
}: LinkTutorialProps): JSX.Element {
  const deps = useDependencies();
  const tutorial = deps.tutorialConfig.getTutorial(tutorialGUID);
  const anchor =
    typeof anchorGUID !== "undefined" ? navigation.getAnchor(anchorGUID) : "";

  let linkText;
  if (typeof content !== "undefined") {
    linkText = content;
  } else if (typeof anchorGUID !== "undefined") {
    linkText = tutorialConfigConst.AnchorName[anchorGUID];
  } else {
    linkText = tutorial.name;
  }

  return (
    <Link href={`${tutorial.url}${anchor}`} shouldOpenTab={shouldOpenTab}>
      {linkText}
    </Link>
  );
}
