import {
  Flex,
  Icon,
  chakra,
  Box
} from "@chakra-ui/react"
import { Styles } from "@src/css"
import React from "react"
import { IoMdAlert } from "react-icons/io"

export interface WarningProps {
  text: string
}

export function Warning({text}: WarningProps) {
  return (
    <Flex
      p={50}
      w="full"
      alignItems="center"
      justifyContent="center"
    >
      <Flex
        maxW="sm"
        w="full"
        mx="auto"
        bg="white"
        shadow="lg"
        borderColor={Styles.borderColorMin}
        border="1px"
        rounded="lg"
        overflow="hidden"
      >
        <Flex justifyContent="center" alignItems="center" w={12}
              bg="yellow.400">
          <Icon as={IoMdAlert} color="white" boxSize={6}/>
        </Flex>

        <Box mx={-3} py={2} px={4}>
          <Box mx={3}>
            <chakra.span
              fontWeight="bold"
            >
              Warning
            </chakra.span>
            <chakra.p
              color="gray.600"
              fontSize="sm"
            >
              {text}
            </chakra.p>
          </Box>
        </Box>
      </Flex>
    </Flex>
  )
}
