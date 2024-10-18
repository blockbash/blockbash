import { type StackProps, VStack } from "@chakra-ui/react";
import React from "react";

/* Wraps the content within a section.
This helps keep equal spacing, etc.
*/
export function SectionWrapper(props: StackProps): JSX.Element {
  const { alignItems = "left", children, spacing = 30 } = props;

  return (
    /* my will space the children correctly with the other content that's on the page.
     * Doing this with margins also allows margins to be collapsed. This is helpful if the other components (on the page) are setting their own margin. */
    <VStack alignItems={alignItems} my={spacing} spacing={spacing} {...props}>
      {children}
    </VStack>
  );
}
