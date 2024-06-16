import { Heading, type HeadingProps } from "@chakra-ui/react";
import React from "react";
export type HeaderLevel = 2 | 3 | 4;

export interface HeaderProps {
  children: React.ReactNode;
  headerMarginBottomOverride?: HeadingProps["marginBottom"];
  headerSizeOverride?: HeadingProps["size"];
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

function getHeaderSize({
  level,
}: {
  level: HeaderLevel;
}): NonNullable<HeadingProps["size"]> {
  switch (level) {
    case 2:
      return "xl";
    case 3:
      return "lg";
    case 4:
      return "md";
  }
}
export function Header({
  children,
  headerMarginBottomOverride = 0,
  headerSizeOverride,
  level,
}: HeaderProps): JSX.Element {
  return (
    <Heading
      as={getHeaderElement({ level })}
      marginBottom={headerMarginBottomOverride}
      size={headerSizeOverride ?? getHeaderSize({ level })}
    >
      {children}
    </Heading>
  );
}
