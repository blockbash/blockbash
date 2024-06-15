import { Text, type TextProps } from "@chakra-ui/react";
import React, { type ReactNode } from "react";

export interface BoldProps extends TextProps {
  children: ReactNode;
}

export function Bold({ children, ...textProps }: BoldProps): JSX.Element {
  return (
    <Text as="b" {...textProps}>
      {children}
    </Text>
  );
}
