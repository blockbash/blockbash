import {
  UnorderedList as _UnorderedList,
  Heading,
  ListItem,
} from "@chakra-ui/react";
import React, { type ReactNode } from "react";

export interface LabStepsProps {
  heading?: string;
  steps: ReactNode[];
}

export function UnorderedList({ heading, steps }: LabStepsProps): JSX.Element {
  return (
    <>
      {heading != null && (
        <Heading fontWeight="semibold" size="lg">
          {heading}
        </Heading>
      )}
      <_UnorderedList>
        {steps.map((steps) => (
          <ListItem>{steps}</ListItem>
        ))}
      </_UnorderedList>
    </>
  );
}
