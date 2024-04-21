import {
  Button,
  ButtonGroup,
  CardBody,
  CardHeader,
  Heading,
} from "@chakra-ui/react"
import { Card, Divider, Link } from "@components"
import { useDependencies } from "@hooks"
import { Styles } from "@site/src/css"
import React from "react"

export function Playlists() {
  const deps = useDependencies()
  deps
    .createLogger()
    .setGlobalContext({logicPath: __filename})
    .logInnerStartExecution({
      functionName: `${Playlists.name}`,
    })

  return (
    <Card boxShadow={Styles.boxShadowMin} maxW="fit-content" mt={16}>
      <CardHeader alignItems="center" pb={0}>
        <Heading size="md">Playlists</Heading>
      </CardHeader>
      <Divider/>
      <CardBody>
        <ButtonGroup size="sm" variant="solid">
          {deps.tutorialConfig.getActiveLearningPaths().map((path) => (
            <Link href={`${path.url}`} key={path.guid} shouldOpenTab={false}>
              <Button
                border="none"
                colorScheme="red"
                size="sm"
                textTransform="capitalize"
              >
                {`${path.name} (${path.count})`}
              </Button>
            </Link>
          ))}
        </ButtonGroup>
      </CardBody>
    </Card>
  )
}
