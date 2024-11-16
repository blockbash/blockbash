import {
  Button,
  ButtonGroup,
  CardBody,
  CardHeader,
  Heading,
} from "@chakra-ui/react";
import { Card, Divider, LinkComponent } from "@components";
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
          {deps.tutorialConfig.getActivePlaylists().map((playlist) => (
            <LinkComponent
              href={`${playlist.url}`}
              key={playlist.guid}
              shouldOpenTab={false}
            >
              <Button size="sm">{`${playlist.name} (${playlist.count})`}</Button>
            </LinkComponent>
          ))}
        </ButtonGroup>
      </CardBody>
    </Card>
  );
}
