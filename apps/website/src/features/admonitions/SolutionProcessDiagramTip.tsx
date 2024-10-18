import { chakra } from "@chakra-ui/react";
import { Tip } from "@components";
import React from "react";

export function SolutionProcessDiagramTip(): JSX.Element {
  return (
    <Tip>
      <chakra.span>
        This section can relate the solution's code to the Process Diagram. Use
        the Process Diagram (and the Process Diagram's Explanation section) to
        understand the solution.
      </chakra.span>
    </Tip>
  );
}
