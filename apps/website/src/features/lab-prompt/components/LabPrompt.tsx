import { tutorialConfigConst } from "@blockbash/common";
import { Code, Heading } from "@chakra-ui/react";
import {
  Bold,
  Error,
  Info,
  Lab,
  Link,
  OrderedList,
  Span,
  Success,
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
          <Span>
            If you're already a Visual Studio Code user, your existing
            extensions should work automatically (e.g., Vim).
          </Span>,
          <Span>
            As the lab isn't being executed within the browser, you'll have a
            more "native" experience.
          </Span>,
          <Span>
            Depending on your computer, it might be faster than the Codespace
            environment.
          </Span>,
        ]}
      />

      <UnorderedList
        heading="Cons"
        steps={[
          <Span>Requires dependencies to be installed (see below).</Span>,
        ]}
      />

      <UnorderedList
        heading="Prerequisites"
        steps={[
          <Span>
            Install{" "}
            <Link
              href="https://code.visualstudio.com/docs/setup/setup-overview"
              shouldOpenTab={true}
            >
              Visual Studio Code
            </Link>
          </Span>,
          <Span>
            Install the{" "}
            <Link
              href="https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers"
              shouldOpenTab={true}
            >
              Dev Containers Extension
            </Link>
          </Span>,
          <Span>
            Install{" "}
            <Link
              href="https://www.docker.com/get-started/"
              shouldOpenTab={true}
            >
              Docker
            </Link>
            <Span>
              (Other container runtimes are not supported at this time.)
            </Span>
          </Span>,
        ]}
      />

      <Warning
        content={
          <Span>
            You must complete the Prerequisites (mentioned above) before
            starting the lab
          </Span>
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
          <Span>The simplest option as it runs the lab in your browser.</Span>,
          <Span>No dependencies to install.</Span>,
        ]}
      />

      <UnorderedList
        heading="Cons"
        steps={[
          <Span>
            Executes on Github's servers which can incur a cost after the free
            tier is exhausted. Luckily, it's easy to set a spending limit of{" "}
            <Code>0</Code> so you won't be charged once the free tier is
            exhausted (instructions below).
          </Span>,
        ]}
      />

      <UnorderedList
        heading="Prerequisites"
        steps={[
          <Span>
            Sign up for a{" "}
            <Link href="https://github.com/signup" shouldOpenTab={true}>
              Github Account
            </Link>
          </Span>,
          <Span>
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
          </Span>,
        ]}
      />

      <Warning
        content={
          <Span>
            You must complete the Prerequisites (mentioned above) before
            starting the lab
          </Span>
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
          <Span>It's time for some hands-on experience! </Span>,
          props.Goal,
          <Span>
            There are two ways to launch the lab environment: i) Github
            Codespaces ii) Visual Studio Code."
          </Span>,
          <Span>
            While each option has its pros/cons, Github Codespaces option is the
            quickest way to get "up and running".
          </Span>,
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
