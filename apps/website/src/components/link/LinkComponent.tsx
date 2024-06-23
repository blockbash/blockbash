import { LinkBox, LinkOverlay } from "@chakra-ui/react";
import DocusaurusLink from "@docusaurus/Link";
import { useDependencies } from "@hooks";
import React from "react";

interface LinkComponentProps {
  children: React.ReactNode;
  href: string;
  shouldOpenTab?: boolean;
}

/**
 * Allows other components (with arbitrary size) to be linkable.
 * If you need to link text, see components in the inline/ directory.
 */
export function LinkComponent(props: LinkComponentProps): JSX.Element {
  const { children, href, shouldOpenTab = false } = props;
  const deps = useDependencies();
  const logger = deps
    .createLogger()
    .setGlobalContext({ logicPath: __filename });
  const onLinkOverlayClick = (): void => {
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
