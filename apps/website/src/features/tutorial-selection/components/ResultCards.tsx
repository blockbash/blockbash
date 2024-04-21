import { Box, Heading, Text } from "@chakra-ui/react"
import {
  type TutorialsWithFuzzyResult
} from "@src/features/tutorial-selection/components/TutorialSelection.types"
import React from "react"

import { ResultCard } from "./ResultCard"

interface ResultsProps {
  tutorials: TutorialsWithFuzzyResult
}

export function ResultCards(props: ResultsProps) {
  const {tutorials} = props
  return (
    <>
      {tutorials.length === 0 && (
        <Box mt={0} padding={12} textAlign="center">
          <Text fontSize="5xl">😮</Text>
          <Heading size="lg">
            Oh no! No tutorial matched your selections
          </Heading>
          <Heading fontWeight="semibold" size="md">
            Try removing a filter or two
          </Heading>
        </Box>
      )}
      {tutorials.map((tutorial) => (
        <ResultCard key={tutorial.guid} tutorial={tutorial}/>
      ))}
    </>
  )
}
