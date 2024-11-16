import { expressiveCodeThemes } from "@site/docusaurus.const";
import React, { type ReactElement } from "react";

import { CodePanelBase } from "../code/CodePanelBase";

interface TerminalCodePanelProps {
  children: ReactElement;
}

export function TerminalCodePanel({
  children,
}: TerminalCodePanelProps): JSX.Element {
  return (
    <CodePanelBase
      maxWidth={"100%"}
      themeName={expressiveCodeThemes.materialThemeDarker}
    >
      {children}
    </CodePanelBase>
  );
}

