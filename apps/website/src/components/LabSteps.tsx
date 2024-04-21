import {
  Heading, ListItem,
  OrderedList,
} from "@chakra-ui/react"
import React, { ReactNode } from "react"

interface LabStepsProps {
  steps: ReactNode[];
}

export function LabSteps({steps}: LabStepsProps) {
  return (
    <>
      <Heading fontWeight="semibold" size="lg">Steps</Heading>
      <OrderedList>
        {steps.map(steps =>
          <ListItem>
            {steps}
          </ListItem>
        )}
      </OrderedList>
    </>
  )
}
