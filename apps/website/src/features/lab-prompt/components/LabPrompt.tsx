import {
  Bold, Lab,
  Link,
  OrderedList,
  Span,
  Tabs,
  UnorderedList
} from "@src/components"
import React, { ReactNode } from "react"
import {
  Code,
} from "@chakra-ui/react"
import {
  tutorialConfigConst
} from "@blockbash/common"

export interface LabPromptProps {
  Goal: ReactNode
  tutorialGUID: tutorialConfigConst.TutorialGUID
  additionalNextSteps: ReactNode[]
}

export function LabPrompt(props: LabPromptProps) {
  const codespacePanel = (
    <>
      <UnorderedList steps={[
        <Span>The simplest option as it runs the lab in your browser.</Span>,
        <Span>No dependencies to install.</Span>
      ]} heading="Pros"/>

      <UnorderedList steps={[
        <Span>
          Executes on Github's servers which can incur a cost after the free
          tier is exhausted. Luckily, it's easy to set a spending limit
          of <Code>0</Code> so you won't be charged once the free tier is
          exhausted (instructions below).
        </Span>,
      ]} heading="Cons"/>

      <UnorderedList steps={[
        <Span>
          Sign up for a <Link href="https://github.com/signup"
                              shouldOpenTab={true}>Github Account</Link>
        </Span>,
        <Span>
          <Bold>OPTIONAL</Bold>: Github will charge for Codespace usage once
          the free tier is exhausted. To ensure that you will never be charged,
          navigate to <Link
          href="https://github.com/settings/billing/spending_limit"
          shouldOpenTab={true}>this link</Link> and ensure
          the <Code>Codespace</Code> spending limit is set
          to <Code>0</Code>.
        </Span>
      ]} heading="Prerequisites"/>

      <OrderedList steps={[
        <Lab tutorialGUID={props.tutorialGUID}
             executionEnvironmentName={tutorialConfigConst.ExecutionEnvironmentName.githubCodespace}/>,
        props.additionalNextSteps
      ]} heading="Next Steps"/>
    </>
  )
  return (
    <>
      <UnorderedList steps={[
        <Span>It's time for some hands-on experience</Span>,
        props.Goal
      ]} heading="Introduction"/>

      <UnorderedList steps={[
        <Span>There are two ways to launch the lab environment: i) Github
          Codespaces ii) Visual Studio Code."</Span>,
        <Span>While each option has its pros/cons, Github Codespaces option is
          the quickest way to get "up and running".</Span>,
      ]} heading="Lab Options"/>

      <Tabs tabs={[{title: "REMOTE: Github Codespace", content: codespacePanel}]}/>
    </>
  )
}
