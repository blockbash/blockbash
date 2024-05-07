import { AdmonitionWrapper } from "@src/components/admonition/AdmonitionWrapper"
import React, { ReactNode } from "react"
import { IoMdAlert } from "react-icons/io"

export interface WarningProps {
  content: ReactNode
}

export function Warning(props: WarningProps) {
  return (
    <AdmonitionWrapper content={props.content} iconBackgroundColor={"yellow.400"}
                       admonitionLabel={"Warning"}
                       icon={IoMdAlert}/>
  )
}
