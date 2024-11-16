import { CodePanelSolutionTip } from "@features";
import { ClassNames } from "@src/css";
import React, { type ReactElement } from "react";

import { CodePanelBase } from "./CodePanelBase";

interface DiffCodePanelProps {
  children: ReactElement;
}

// Used to render a CodePanel that DOES use a DIFF txt file.
export function DiffCodePanel(props: DiffCodePanelProps): JSX.Element {
  return (
    <>
      <CodePanelSolutionTip showHighlightInstructions />
      <CodePanelBase
        maxWidth={"100%"}
        prependClassName={ClassNames.diffCodePanel}
      >
        {props.children}
      </CodePanelBase>
    </>
  );
}
