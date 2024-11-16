import {
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Spacer,
  TagLabel,
  Text,
  Wrap,
} from "@chakra-ui/react";
import { Card, ContentGroupTag, Divider, LinkComponent } from "@components";
import { type TutorialWithFuzzyResult } from "@src/features/tutorial-selection/components/TutorialSelection.types";
import React from "react";

export interface ResultCardProps {
  tutorial: TutorialWithFuzzyResult;
}

export function ResultCard(props: ResultCardProps): JSX.Element {
  const { tutorial } = props;
  return (
    <LinkComponent href={tutorial.url} shouldOpenTab={false}>
      <Card _hover={{ boxShadow: "outline" }}>
        <CardHeader>
          <Flex gap="1" mb={[2, 1]}>
            <Text fontSize={["md", "2xl"]} fontWeight="semibold" mb={1}>
              {tutorial.name}
            </Text>
            <Spacer />
            <ContentGroupTag colorScheme="facebook" maxH={10}>
              <TagLabel>{tutorial.difficultyName}</TagLabel>
            </ContentGroupTag>
          </Flex>
          <Wrap
            fontSize="sm"
            shouldWrapChildren
            spacing={0.5}
            textTransform="capitalize"
            whiteSpace="pre"
          >
            <Text mb={0}>
              {`🚗 ${tutorial.playlist.name}`}
              {"  "}
              {` ✍️ ${tutorial.authorName}`}
            </Text>
            <Text mb={0}>
              {` 🗓️️ ${tutorial.publishedDate.toLocaleDateString("en-US", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}`}
              {"  "}
              {` ⏱️ ${tutorial.durationMinutes} minutes`}
            </Text>
          </Wrap>
          <Divider />
        </CardHeader>
        <CardBody>
          <Text fontSize="md">{tutorial.description}</Text>
        </CardBody>
        <CardFooter>
          <Wrap shouldWrapChildren>
            {tutorial.categories.map((contentCategory) => (
              <ContentGroupTag
                boxShadow="md"
                colorScheme="gray"
                key={contentCategory.guid}
              >
                <TagLabel>{contentCategory.name}</TagLabel>
              </ContentGroupTag>
            ))}
          </Wrap>
        </CardFooter>
      </Card>
    </LinkComponent>
  );
}
