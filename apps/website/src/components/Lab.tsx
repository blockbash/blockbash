import {
  type tutorialConfigTypes,
  tutorialConfigConst
} from "@blockbash/common"
import {
  Button,
  Stack,
  chakra
} from "@chakra-ui/react"
import { LinkWrapper } from "@components"
import { useDependencies } from "@hooks"
import React from "react"

interface LabProps {
  tutorialGUID: tutorialConfigTypes.TutorialGUID
  executionEnvironmentName: tutorialConfigConst.ExecutionEnvironmentName
}

export function Lab(props: LabProps) {
  const deps = useDependencies()
  const {tutorialGUID} = props
  const tutorial = deps.tutorialConfig.getTutorial(tutorialGUID)
  let url: string
  if (props.executionEnvironmentName === tutorialConfigConst.ExecutionEnvironmentName.githubCodespace) {
    url = tutorial.lab?.codespaceURL as string
  }
  else if (props.executionEnvironmentName === tutorialConfigConst.ExecutionEnvironmentName.visualStudioCode) {
    url = tutorial.lab?.vscodeURL as string
  } else {
    throw new Error(`Unexpected executionEnviornmentName: ${props.executionEnvironmentName}`)
  }
  return (
    <>
      <Stack align="center" direction="row" justify="flex-start">
        <chakra.span>Click</chakra.span>
        <LinkWrapper href={url} shouldOpenTab>
          <Button
            border="none"
            colorScheme="red"
            size="sm"
            textTransform="capitalize"
          >
            Initialize {props.executionEnvironmentName} Lab
          </Button>
        </LinkWrapper>
      </Stack>
    </>
  )
}
