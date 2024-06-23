import {
  tutorialConfigConst,
  type tutorialConfigTypes,
} from "@blockbash/common";
import { navigation } from "@utils";
import React from "react";

import { Link } from "./Link";

export interface LinkAnchorProps {
  anchorGUID: tutorialConfigTypes.AnchorGUID;
  content?: string;
  shouldOpenTab?: boolean;
}

/**
 * Inline component for linking anchors on the same page.  For linking anchors
 * on another page, see TutorialLink
 */
export function LinkAnchor({
  anchorGUID,
  content,
  shouldOpenTab = false,
}: LinkAnchorProps): JSX.Element {
  return (
    <Link
      href={`${navigation.getAnchor(anchorGUID)}`}
      shouldOpenTab={shouldOpenTab}
    >
      {content ?? tutorialConfigConst.AnchorName[anchorGUID]}
    </Link>
  );
}
