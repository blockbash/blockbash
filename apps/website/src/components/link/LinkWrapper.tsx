import { LinkBox, LinkOverlay, type LinkOverlayProps } from "@chakra-ui/react";
import DocusaurusLink from "@docusaurus/Link";
import { useDependencies } from "@hooks";
import React from "react";

interface LinkProps extends LinkOverlayProps {
  href: string;
  shouldOpenTab: boolean;
}

/**
 * Allows other components to be linkable.
 * If you need to link text, see Link component.
 */
export function LinkWrapper(props: LinkProps): JSX.Element {
  const { children, href, shouldOpenTab } = props;
  const deps = useDependencies();
  const logger = deps
    .createLogger()
    .setGlobalContext({ logicPath: __filename });
  const onLinkOverlayClick = () => {
    logger.logInnerStartExecution({
      functionName: `${onLinkOverlayClick.name}`,
      metadata: { href, shouldOpenTab },
    });
  };

  return (
    <LinkBox>
      <LinkOverlay
        as={DocusaurusLink}
        href={href}
        isExternal={shouldOpenTab}
        onClick={onLinkOverlayClick}
      >
        {children}
      </LinkOverlay>
    </LinkBox>
  );
}
