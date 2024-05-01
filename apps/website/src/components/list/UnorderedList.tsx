import {
  Heading, ListItem,
  UnorderedList as _UnorderedList,
} from "@chakra-ui/react"
import React, { ReactNode } from "react"

export interface LabStepsProps {
  steps: ReactNode[];
  heading: string
}

export function UnorderedList({steps, heading}: LabStepsProps) {
  return (
    <>
      <Heading fontWeight="semibold" size="lg">{heading}</Heading>
      <_UnorderedList>
        {steps.map(steps =>
          <ListItem>
            {steps}
          </ListItem>
        )}
      </_UnorderedList>
    </>
  )
}
