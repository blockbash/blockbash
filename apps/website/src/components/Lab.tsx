import { type tutorialConfigTypes } from "@blockbash/common"
import {
  Button,
  Stack,
  Text,
} from "@chakra-ui/react"
import { Link } from "@components"
import { useDependencies } from "@hooks"
import React from "react"

interface LabProps {
  tutorialGUID: tutorialConfigTypes.TutorialGUID;
}

export function Lab(props: LabProps) {
  const deps = useDependencies()
  const {tutorialGUID} = props
  const tutorial = deps.tutorialConfig.getTutorial(tutorialGUID)
  const vscodeURL = tutorial.lab?.vscodeURL as string
  const codespaceURL = tutorial.lab?.codespaceURL as string
  return (
    <>
      <Stack align="center" direction="row" justify="flex-start">
        <Text as="span">Click</Text>
        <Link href={vscodeURL} shouldOpenTab>
          <Button
            border="none"
            colorScheme="red"
            size="sm"
            textTransform="capitalize"
          >
            Initialize Visual Studio Code Lab
          </Button>
        </Link>
        <Text as="span">or</Text>
        <Link href={codespaceURL} shouldOpenTab>
          <Button
            border="none"
            colorScheme="red"
            size="sm"
            textTransform="capitalize"
          >
            Initialize Github Codespace Lab
          </Button>
        </Link>
      </Stack>
    </>
  )
}
