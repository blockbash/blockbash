import { AdmonitionWrapper } from "@src/components/admonition/AdmonitionWrapper"
import React, { ReactNode } from "react"
import { BsLightningFill } from "react-icons/bs"

export interface ErrorProps {
  content: ReactNode
}

export function Error(props: ErrorProps) {
  return (
    <AdmonitionWrapper content={props.content} iconBackgroundColor={"red.500"}
                       admonitionLabel={"Error"}
                       icon={BsLightningFill}/>
  )
}
