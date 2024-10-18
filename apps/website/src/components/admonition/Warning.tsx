import { Styles } from "@src/css";
import React from "react";
import { IoMdAlert } from "react-icons/io";

import { AdmonitionWrapper } from "./AdmonitionWrapper";
import { type AdmonitionProps } from "./admonition.types";

export function Warning({
  children,
  isCentered = false,
  isFlattened = true,
  labelOverride,
}: AdmonitionProps): JSX.Element {
  return (
    /* admonitionLabelColor: Using yellow is visually jarring */
    <AdmonitionWrapper
      icon={IoMdAlert}
      iconBackgroundColor={Styles.yellowPrimaryColor}
      isCentered={isCentered}
      isFlattened={isFlattened}
      label={typeof labelOverride === "undefined" ? "Warning" : labelOverride}
      labelColor={"black"}
    >
      {children}
    </AdmonitionWrapper>
  );
}
