import { tutorialConfigConst } from "@blockbash/common";
import { Code, Heading, chakra } from "@chakra-ui/react";
import {
  Bold,
  Error,
  Info,
  Lab,
  Link,
  LinkWrapper,
  OrderedList,
  Tabs,
  UnorderedList,
  Warning,
} from "@src/components";
import React, { type ReactNode } from "react";

export interface LabPromptProps {
  Goal: ReactNode;
  additionalNextSteps: ReactNode[];
  tutorialGUID: tutorialConfigConst.TutorialGUID;
}

export function LabPrompt(props: LabPromptProps): JSX.Element {
  const vscodePanel = (
    <>
      <UnorderedList
        heading="Pros"
        steps={[
          <chakra.span>
            If you're already a Visual Studio Code user, your existing
            extensions should work automatically (e.g., Vim).
          </chakra.span>,
          <chakra.span>
            As the lab isn't being executed within the browser, you'll have a
            more "native" experience.
          </chakra.span>,
          <chakra.span>
            Depending on your computer, it might be faster than the Codespace
            environment.
          </chakra.span>,
        ]}
      />

      <UnorderedList
        heading="Cons"
        steps={[
          <chakra.span>Requires dependencies to be installed (see below).</chakra.span>,
        ]}
      />

      <UnorderedList
        heading="Prerequisites"
        steps={[
          <chakra.span>
            Install{" "}
            <LinkWrapper
              href="https://code.visualstudio.com/docs/setup/setup-overview"
              shouldOpenTab={true}
            >
              Visual Studio Code
            </LinkWrapper>
          </chakra.span>,
          <chakra.span>
            Install the{" "}
            <LinkWrapper
              href="https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers"
              shouldOpenTab={true}
            >
              Dev Containers Extension
            </LinkWrapper>
          </chakra.span>,
          <chakra.span>
            Install{" "}
            <LinkWrapper
              href="https://www.docker.com/get-started/"
              shouldOpenTab={true}
            >
              Docker
            </LinkWrapper>
            <chakra.span>
              (Other container runtimes are not supported at this time.)
            </chakra.span>
          </chakra.span>,
        ]}
      />

      <Warning
        content={
          <chakra.span>
            You must complete the Prerequisites (mentioned above) before
            starting the lab
          </chakra.span>
        }
      />

      <OrderedList
        heading="Next Steps"
        steps={[
          <Lab
            executionEnvironmentName={
              tutorialConfigConst.ExecutionEnvironmentName.visualStudioCode
            }
            tutorialGUID={props.tutorialGUID}
          />,
          props.additionalNextSteps,
        ]}
      />
    </>
  );
  const codespacePanel = (
    <>
      <UnorderedList
        heading="Pros"
        steps={[
          <chakra.span>The simplest option as it runs the lab in your browser.</chakra.span>,
          <chakra.span>No dependencies to install.</chakra.span>,
        ]}
      />

      <UnorderedList
        heading="Cons"
        steps={[
          <chakra.span>
            Executes on Github's servers which can incur a cost after the free
            tier is exhausted. Luckily, it's easy to set a spending limit of{" "}
            <Code>0</Code> so you won't be charged once the free tier is
            exhausted (instructions below).
          </chakra.span>,
        ]}
      />

      <UnorderedList
        heading="Prerequisites"
        steps={[
          <chakra.span>
            Sign up for a{" "}
            <Link href="https://github.com/signup" shouldOpenTab={true}>
              <chakra.span>Github Account</chakra.span>
            </Link>
          </chakra.span>,
          <chakra.span>
            <Bold>OPTIONAL</Bold>: Github will charge for Codespace usage once
            the free tier is exhausted. To ensure that you will never be
            charged, navigate to{" "}
            <Link
              href="https://github.com/settings/billing/spending_limit"
              shouldOpenTab={true}
            >
              this link
            </Link>{" "}
            and ensure the <Code>Codespace</Code> spending limit is set to{" "}
            <Code>0</Code>.
          </chakra.span>,
        ]}
      />

      <Warning
        content={
          <chakra.span>
            You must complete the Prerequisites (mentioned above) before
            starting the lab
          </chakra.span>
        }
      />

      <OrderedList
        heading="Next Steps"
        steps={[
          <Lab
            executionEnvironmentName={
              tutorialConfigConst.ExecutionEnvironmentName.githubCodespace
            }
            tutorialGUID={props.tutorialGUID}
          />,
          props.additionalNextSteps,
        ]}
      />
    </>
  );
  return (
    <>
      <UnorderedList
        heading="Introduction"
        steps={[
          <chakra.span>It's time for some hands-on experience! </chakra.span>,
          props.Goal,
          <chakra.span>
            There are two ways to launch the lab environment: i) Github
            Codespaces ii) Visual Studio Code."
          </chakra.span>,
          <chakra.span>
            While each option has its pros/cons, Github Codespaces option is the
            quickest way to get "up and running".
          </chakra.span>,
        ]}
      />

      <Heading fontWeight="semibold" size="lg">
        Lab Options
      </Heading>

      <Tabs
        tabs={[
          { content: codespacePanel, title: "Github Codespace" },
          { content: vscodePanel, title: "VSCode" },
        ]}
      />
    </>
  );
}
