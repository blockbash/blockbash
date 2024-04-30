import {
  Text, TextProps,
} from "@chakra-ui/react"
import React, { ReactNode } from "react"

export interface SpanProps extends TextProps{
  children: ReactNode
}

export function Span({children}: SpanProps) {
  return (
    <Text as="span">{children}</Text>
  )
}
