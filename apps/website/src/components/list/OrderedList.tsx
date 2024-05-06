import {
  OrderedList as _OrderedList,
  Heading,
  ListItem,
} from "@chakra-ui/react";
import React, { type ReactNode } from "react";

export interface LabStepsProps {
  heading?: string;
  steps: ReactNode[];
}

export function OrderedList({ heading, steps }: LabStepsProps) {
  return (
    <>
      {heading != null && (
        <Heading fontWeight="semibold" size="lg">
          {heading}
        </Heading>
      )}
      <_OrderedList>
        {steps.map((steps) => (
          <ListItem>{steps}</ListItem>
        ))}
      </_OrderedList>
    </>
  );
}
