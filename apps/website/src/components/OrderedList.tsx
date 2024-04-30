import {
  Heading, ListItem,
  OrderedList as _OrderedList,
} from "@chakra-ui/react"
import React, { ReactNode } from "react"

export interface LabStepsProps {
  steps: ReactNode[];
  heading: string
}

export function OrderedList({steps, heading}: LabStepsProps) {
  return (
    <>
      <Heading fontWeight="semibold" size="lg">{heading}</Heading>
      <_OrderedList>
        {steps.map(steps =>
          <ListItem>
            {steps}
          </ListItem>
        )}
      </_OrderedList>
    </>
  )
}
