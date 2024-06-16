import { Styles } from "@src/css";
import React from "react";
import { IoMdAlert } from "react-icons/io";

import { AdmonitionWrapper } from "./AdmonitionWrapper";
import { type AdmonitionProps } from "./admonition.types";

export function Warning(props: AdmonitionProps): JSX.Element {
  return (
    /* admonitionLabelColor: Using yellow is visually jarring */
    <AdmonitionWrapper
      icon={IoMdAlert}
      iconBackgroundColor={Styles.yellowPrimaryColor}
      label={"Warning"}
      labelColor={"black"}
    >
      {props.children}
    </AdmonitionWrapper>
  );
}
