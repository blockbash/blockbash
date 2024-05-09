import { ColorProps } from "@chakra-ui/react"
import { AdmonitionWrapper } from "@src/components/admonition/AdmonitionWrapper"
import React, { ReactNode } from "react"
import { BsLightningFill } from "react-icons/bs"

export interface ErrorProps {
  content: ReactNode
}

export function Error(props: ErrorProps) {
  const color: NonNullable<ColorProps["color"]> = "red.500"
  return (
    <AdmonitionWrapper content={props.content} iconBackgroundColor={color}
                       admonitionLabelColor={color}
                       admonitionLabel={"Error"}
                       icon={BsLightningFill}/>
  )
}
