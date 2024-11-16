import { chakra } from "@chakra-ui/react";
import { Bold, InlineTip } from "@components";
import React from "react";

export function NonIdealPattern(): JSX.Element {
  return (
    <>
      <InlineTip label={"Reflection"} />
      <chakra.span>
        {" "}
        One way to learn about an "ideal" implementation is to learn non-ideal
        variants. As you experiment with this pattern,{" "}
        <Bold>
          <chakra.text as={"u"}>
            reflect on how this pattern might NOT be ideal
          </chakra.text>
        </Bold>
        .
      </chakra.span>
    </>
  );
}
