import {
  Button,
  ButtonGroup,
  CardBody,
  CardHeader,
  Heading,
} from "@chakra-ui/react";
import { Card, Divider, LinkWrapper } from "@components";
import { useDependencies } from "@hooks";
import { Styles } from "@site/src/css";
import React from "react";

export function Playlists(): JSX.Element {
  const deps = useDependencies();
  deps
    .createLogger()
    .setGlobalContext({ logicPath: __filename })
    .logInnerStartExecution({
      functionName: `${Playlists.name}`,
    });

  return (
    <Card boxShadow={Styles.boxShadowMin} maxW="fit-content" mt={16}>
      <CardHeader alignItems="center" pb={0}>
        <Heading size="md">Playlists</Heading>
      </CardHeader>
      <Divider />
      <CardBody>
        <ButtonGroup size="sm" variant="solid">
          {deps.tutorialConfig.getActiveLearningPaths().map((path) => (
            <LinkWrapper
              href={`${path.url}`}
              key={path.guid}
              shouldOpenTab={false}
            >
              <Button size="sm">{`${path.name} (${path.count})`}</Button>
            </LinkWrapper>
          ))}
        </ButtonGroup>
      </CardBody>
    </Card>
  );
}
