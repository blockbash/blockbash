import { type ColorProps } from "@chakra-ui/react";
import { AdmonitionWrapper, type admonitionTypes } from "@components";
import React from "react";
import { AiTwotoneExperiment } from "react-icons/ai";

export function ExperimentalChallenge(
  props: admonitionTypes.AdmonitionProps,
): JSX.Element {
  const color: NonNullable<ColorProps["color"]> = "blue.500";
  return (
    <AdmonitionWrapper
      icon={AiTwotoneExperiment}
      iconBackgroundColor={color}
      isCentered={false}
      isFlattened={false}
      label={"Experimental Challenge"}
      labelColor={color}
    >
      {props.children}
    </AdmonitionWrapper>
  );
}
