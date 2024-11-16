import { tutorialConfigConst } from "@blockbash/common";
import { Box, Center, Code, ListItem, chakra } from "@chakra-ui/react";
import {
  Bold,
  Header,
  Lab,
  Link,
  LinkTutorial,
  OrderedList,
  Tabs,
  Tip,
  UnorderedList,
  Warning,
} from "@src/components";
import React from "react";

export interface LabOptionsProps {
  tutorialGUID: tutorialConfigConst.TutorialGUID;
}

export function LabOptions(props: LabOptionsProps): JSX.Element {
  const prerequisitesWarning = (
    <Center mb={3}>
      <Warning>
        <chakra.span>
          You must complete the Prerequisites (mentioned above) before starting
          the lab.
        </chakra.span>
      </Warning>
    </Center>
  );

  const labWorkflowCTA = (
    <chakra.span>
      Complete the steps within the{" "}
      <LinkTutorial
        anchorGUID={tutorialConfigConst.AnchorGUID.labWorkflow}
        tutorialGUID={props.tutorialGUID}
      />{" "}
      section.
    </chakra.span>
  );

  const needHelpTip = (
    <Center>
      <Tip>
        <chakra.span>
          If you have a question (or problem), please review the{" "}
          <LinkTutorial
            anchorGUID={tutorialConfigConst.AnchorGUID.needHelp}
            tutorialGUID={props.tutorialGUID}
          />{" "}
          section.
        </chakra.span>
      </Tip>
    </Center>
  );

  const vscodePanel = (
    <>
      <Header
        anchorGUID={tutorialConfigConst.AnchorGUID.labOptionsPros}
        level={3}
      />
      <UnorderedList>
        <ListItem>
          If you're already a Visual Studio Code user, your preexisting setup
          should be applied. This includes keybindings, extensions, etc.
        </ListItem>
        <ListItem>
          As the lab isn't being executed within the browser, you'll have a more
          "native" experience.
        </ListItem>
        <ListItem>
          Depending on your computer, the experience might be faster than the
          Codespace environment.
        </ListItem>
      </UnorderedList>

      <Header
        anchorGUID={tutorialConfigConst.AnchorGUID.labOptionsCons}
        level={3}
      />
      <UnorderedList>
        <ListItem>Requires dependencies to be installed (see below).</ListItem>
      </UnorderedList>

      <Header
        anchorGUID={tutorialConfigConst.AnchorGUID.labOptionsPrerequisites}
        level={3}
      />
      <UnorderedList>
        <ListItem>
          Install{" "}
          <Link
            href="https://code.visualstudio.com/docs/setup/setup-overview"
            shouldOpenTab={true}
          >
            Visual Studio Code
          </Link>
          .
        </ListItem>
        <ListItem>
          Install the{" "}
          <Link
            href="https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers"
            shouldOpenTab={true}
          >
            Dev Containers Extension
          </Link>
          .
        </ListItem>
        <ListItem>
          Install{" "}
          <Link href="https://www.docker.com/get-started/" shouldOpenTab={true}>
            Docker
          </Link>
          <chakra.span>
            {" "}
            (other container runtimes are not officially supported).
          </chakra.span>
        </ListItem>
      </UnorderedList>

      {prerequisitesWarning}

      <Header
        anchorGUID={tutorialConfigConst.AnchorGUID.labOptionsNextSteps}
        level={3}
      />
      <OrderedList>
        <ListItem>
          <Lab
            executionEnvironmentName={
              tutorialConfigConst.ExecutionEnvironmentName.visualStudioCode
            }
            tutorialGUID={props.tutorialGUID}
          />
          <ListItem>{labWorkflowCTA}</ListItem>
        </ListItem>
      </OrderedList>

      {needHelpTip}
    </>
  );
  const codespacePanel = (
    <>
      <Header
        anchorGUID={tutorialConfigConst.AnchorGUID.labOptionsPros}
        level={3}
      />
      <UnorderedList>
        <ListItem>Access the lab directly through your web browser.</ListItem>
        <ListItem>There are no dependencies to install.</ListItem>
      </UnorderedList>

      <Header
        anchorGUID={tutorialConfigConst.AnchorGUID.labOptionsCons}
        level={3}
      />
      <UnorderedList>
        <ListItem>
          Executes on GitHub's servers. This has a financial cost if the{" "}
          <Link
            href={
              "https://docs.github.com/en/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts"
            }
            shouldOpenTab={true}
          >
            free tier
          </Link>{" "}
          is exhausted. Luckily, it's easy to set a spending limit of{" "}
          <Code>0</Code> so you won't be charged (instructions below).
        </ListItem>
      </UnorderedList>

      <Header
        anchorGUID={tutorialConfigConst.AnchorGUID.labOptionsPrerequisites}
        level={3}
      />
      <UnorderedList>
        <ListItem>
          Sign up for a{" "}
          <Link href="https://github.com/signup" shouldOpenTab={true}>
            Github account
          </Link>
          .
        </ListItem>
        <ListItem>
          <Bold>IMPORTANT</Bold>: Github will charge for Codespace usage once
          the{" "}
          <Link
            href={
              "https://docs.github.com/en/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts"
            }
            shouldOpenTab={true}
          >
            free tier
          </Link>{" "}
          is exhausted. If you don't want to be charged, navigate to{" "}
          <Link
            href="https://github.com/settings/billing/spending_limit"
            shouldOpenTab={true}
          >
            this link
          </Link>{" "}
          and ensure the Codespaces spending limit is set to <Code>0</Code>.
          Blockbash (and its contributors) are not responsible for any
          unexpected charges.
        </ListItem>
      </UnorderedList>

      {prerequisitesWarning}

      <Header
        anchorGUID={tutorialConfigConst.AnchorGUID.labOptionsNextSteps}
        level={3}
      />
      <OrderedList>
        <ListItem>
          <Lab
            executionEnvironmentName={
              tutorialConfigConst.ExecutionEnvironmentName.githubCodespace
            }
            tutorialGUID={props.tutorialGUID}
          />
        </ListItem>
        <ListItem>{labWorkflowCTA}</ListItem>
      </OrderedList>

      {needHelpTip}
    </>
  );
  return (
    <Box maxWidth={"2xl"}>
      <Tabs
        tabs={[
          { content: codespacePanel, title: "Github Codespace" },
          { content: vscodePanel, title: "Visual Studio Code" },
        ]}
      />
    </Box>
  );
}
