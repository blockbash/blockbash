import { Admonition } from "@src/components/admonition/Admonition"
import React, { ReactNode } from "react"
import { BsLightningFill } from "react-icons/bs"

export interface ErrorProps {
  content: ReactNode
}

export function Error(props: ErrorProps) {
  return (
    <Admonition content={props.content} iconBackgroundColor={"red.500"}
                admonitionLabel={"Error"}
                icon={BsLightningFill}/>
  )
}
