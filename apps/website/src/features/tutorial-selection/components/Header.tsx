import { Box, Heading } from "@chakra-ui/react"
import React from "react"

export function Header() {
  return (
    <Box textAlign="center">
      <Heading as="h1" fontWeight="bold" size="xl" textTransform="uppercase">
        Blockbash
      </Heading>
      <Heading as="h1" fontWeight="light" size="md" textTransform="capitalize">
        Where developers learn Blockchain security
      </Heading>
    </Box>
  )
}
