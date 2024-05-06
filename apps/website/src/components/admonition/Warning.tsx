import { Admonition } from "@src/components/admonition/Admonition"
import React, { ReactNode } from "react"
import { IoMdAlert } from "react-icons/io"

export interface WarningProps {
  content: ReactNode
}

export function Warning(props: WarningProps) {
  return (
    <Admonition content={props.content} iconBackgroundColor={"yellow.400"}
                admonitionLabel={"Warning"}
                icon={IoMdAlert}/>
  )
}
