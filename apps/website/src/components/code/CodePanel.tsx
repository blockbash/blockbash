import React, { type ReactElement } from "react";

import { CodePanelBase } from "./CodePanelBase";

interface CodePanelProps {
  children: ReactElement;
}

// Used to render a CodePanel that does NOT use a DIFF txt file.
export function CodePanel(props: CodePanelProps): JSX.Element {
  return <CodePanelBase maxWidth={"100%"}>{props.children}</CodePanelBase>;
}
