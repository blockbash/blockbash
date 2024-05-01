import {
  Text, TextProps,
} from "@chakra-ui/react"
import React, { ReactNode } from "react"

export interface BoldProps extends TextProps{
  children: ReactNode
}

export function Bold({children}: BoldProps) {
  return (
    <Text as="b">{children}</Text>
  )
}
