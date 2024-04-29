import {
  Heading, ListItem,
  OrderedList,
} from "@chakra-ui/react"
import React, { ReactNode } from "react"

interface LabStepsProps {
  steps: ReactNode[];
}

export function LabSteps({steps}: LabStepsProps): JSX.Element {
  return (
    <>
      <Heading fontWeight="semibold" size="lg">Steps</Heading>
      <OrderedList>
        {steps.map((steps): JSX.Element =>
          <ListItem>
            {steps}
          </ListItem>
        )}
      </OrderedList>
    </>
  )
}
