import { Code, chakra } from "@chakra-ui/react";
import { SectionWrapper, Tip } from "@components";
import { expressiveCodeThemes } from "@site/docusaurus.const";
import React, { type ReactNode } from "react";

import { CodePanel } from "./CodePanel";

interface TerminalCodePanelProps {
  children: ReactNode;
}

/* To generate terminal content:
 * 1. Go into lab environment and execute: cvs | code -
 * 2. Paste ansi output into output/
 * 3. Prepend 'root@e5563de51d25:/workspaces/blockbash# cv ' into output file
 * 4. Review any colors that aren't rendered correctly in UI
 * */
export function TerminalCodePanel(props: TerminalCodePanelProps): JSX.Element {
  return (
    <>
      <SectionWrapper>
        <Tip>
          <chakra.span>
            Use the terminal output (below) to understand the execution events
            that occurred.
          </chakra.span>
        </Tip>
        <CodePanel themeName={expressiveCodeThemes.materialThemeDarker}>
          {props.children}
        </CodePanel>
      </SectionWrapper>
    </>
  );
}
