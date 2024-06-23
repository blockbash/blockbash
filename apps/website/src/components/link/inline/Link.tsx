import { Link as ChakraLink, chakra } from "@chakra-ui/react";
import DocusaurusLink from "@docusaurus/Link";
import { useDependencies } from "@hooks";
import React from "react";

export interface LinkProps {
  children: React.ReactNode;
  href: string;
  shouldOpenTab: boolean;
}
/* Base link component
 * If possible, use AnchorLink, TutorialLink
 * */
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
      <chakra.span>{children}</chakra.span>
    </ChakraLink>
  );
}
