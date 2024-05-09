import {
  Link as ChakraLink,
  type LinkProps as ChakraLinkProps,
} from "@chakra-ui/react";
import DocusaurusLink from "@docusaurus/Link";
import { useDependencies } from "@hooks";
import React from "react";

interface LinkProps extends ChakraLinkProps {
  href: string;
  shouldOpenTab: boolean;
}

/**
 * Allows in-line components (e.g., text) to be linkable.
 * If you need to link a full component, see LinkWrapper component.
 */
export function Link(props: LinkProps): JSX.Element {
  const { children, href, shouldOpenTab } = props;
  const deps = useDependencies();
  const logger = deps
    .createLogger()
    .setGlobalContext({ logicPath: __filename });
  const onLinkClick = (): void => {
    logger.logInnerStartExecution({
      functionName: `${onLinkClick.name}`,
      metadata: { href, shouldOpenTab },
    });
  };

  return (
    <ChakraLink
      as={DocusaurusLink}
      // Color should match other docusaurus links
      color={"var(--ifm-link-color)"}
      href={href}
      isExternal={shouldOpenTab}
      onClick={onLinkClick}
    >
      {children}
    </ChakraLink>
  );
}
