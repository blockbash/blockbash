import { AddIcon } from "@chakra-ui/icons";
import { TagLabel, TagLeftIcon, type TagProps } from "@chakra-ui/react";
import { ContentGroupTag, LinkWrapper } from "@components";
import React from "react";

interface ContentGroupTagProps extends TagProps {
  internalLink?: string;
  isActive?: boolean;
  name: string;
}

export function FilterContentGroupTag(
  props: ContentGroupTagProps,
): JSX.Element {
  const { isActive, name, ...rest } = props;
  const tag = (
    <ContentGroupTag
      colorScheme="red"
      layerStyle="hover"
      outline={isActive === true ? "3px solid" : "none"}
      variant="subtle"
      {...rest}
    >
      <TagLeftIcon as={AddIcon} boxSize="12px" />
      <TagLabel textTransform="capitalize">{name}</TagLabel>
    </ContentGroupTag>
  );

  let content;
  if (props.internalLink !== undefined) {
    content = (
      <LinkWrapper href={props.internalLink} shouldOpenTab={false}>
        {tag}
      </LinkWrapper>
    );
  } else {
    content = tag;
  }

  return content;
}
