import {
  tutorialConfigConst,
  type tutorialConfigTypes,
} from "@blockbash/common";
import { Button, Stack, chakra } from "@chakra-ui/react";
import { LinkWrapper } from "@components";
import { useDependencies } from "@hooks";
import React from "react";

interface LabProps {
  executionEnvironmentName: tutorialConfigConst.ExecutionEnvironmentName;
  tutorialGUID: tutorialConfigTypes.TutorialGUID;
}

export function Lab(props: LabProps): JSX.Element {
  const deps = useDependencies();
  const { executionEnvironmentName, tutorialGUID } = props;
  const tutorial = deps.tutorialConfig.getTutorial(tutorialGUID);
  let url: string;
  if (
    executionEnvironmentName ===
    tutorialConfigConst.ExecutionEnvironmentName.githubCodespace
  ) {
    url = tutorial.lab?.codespaceURL as string;
  } else if (
    executionEnvironmentName ===
    tutorialConfigConst.ExecutionEnvironmentName.visualStudioCode
  ) {
    url = tutorial.lab?.vscodeURL as string;
  } else {
    throw new Error(`Unexpected executionEnvironmentName`);
  }
  return (
    <>
      <Stack
        align="center"
        direction={["column", "row", "row"]}
        justify="flex-start"
      >
        <chakra.span>Click</chakra.span>
        <LinkWrapper href={url} shouldOpenTab>
          <Button size="sm">
            Initialize {props.executionEnvironmentName} Lab
          </Button>
        </LinkWrapper>
      </Stack>
    </>
  );
}
