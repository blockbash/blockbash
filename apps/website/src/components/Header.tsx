import { tutorialConfigConst } from "@blockbash/common";
import { Heading, type HeadingProps } from "@chakra-ui/react";
import React from "react";
export type HeaderLevel = 2 | 3 | 4;

export interface HeaderProps {
  anchorGUID: tutorialConfigConst.AnchorGUID;
  headerMarginBottomOverride?: HeadingProps["marginBottom"];
  level: HeaderLevel;
}

function getHeaderElement({
  level,
}: {
  level: HeaderLevel;
}): "h2" | "h3" | "h4" {
  switch (level) {
    case 2:
      return "h2";
    case 3:
      return "h3";
    case 4:
      return "h4";
  }
}
export function Header({
  anchorGUID,
  headerMarginBottomOverride = 0,
  level,
}: HeaderProps): JSX.Element {
  return (
    <Heading
      as={getHeaderElement({ level })}
      fontFamily={"var(--ifm-heading-font-family)"}
      fontSize={`var(--ifm-h${level}-font-size)`}
      fontWeight={"var(--ifm-heading-font-weight)"}
      id={anchorGUID}
      marginBottom={headerMarginBottomOverride}
    >
      {tutorialConfigConst.AnchorName[anchorGUID]}
    </Heading>
  );
}
