import { type LinkProps as ChakraLinkProps } from "@chakra-ui/react";

export interface LinkProps extends ChakraLinkProps {
  href: string;
  shouldOpenTab: boolean;
}
