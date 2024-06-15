import { type StackProps, VStack } from "@chakra-ui/react";
import React from "react";

/* Wraps the content within a section.
This helps keep equal spacing, etc.
*/
export function SectionWrapper(props: StackProps): JSX.Element {
  const { alignItems = "left", children, marginTop = 0, spacing = 30 } = props;

  return (
    <VStack
      alignItems={alignItems}
      marginTop={marginTop}
      spacing={spacing}
      {...props}
    >
      {children}
    </VStack>
  );
}
