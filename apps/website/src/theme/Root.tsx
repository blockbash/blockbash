import {
  type ButtonProps,
  ChakraProvider,
  extendTheme,
} from "@chakra-ui/react";
import { sharedInlineStyles } from "@src/components/global-styles.const";
import { Styles } from "@src/css";
import { dependencyProviderDependencies } from "@src/providers/dependency";
import { DependencyProvider, createLogger } from "@utils";
// @ts-expect-error: chakra-ui-steps needs to update its typing conventions
import { StepsTheme as Steps } from "chakra-ui-steps";
import React from "react";
const commonButtonBaseStyle: ButtonProps = {
  border: "none",
  textTransform: "capitalize",
};
// https://v2.chakra-ui.com/docs/styled-system/customize-theme
const customTheme = extendTheme({
  components: {
    /*
     * For some reason, I cant set base styles on UnorderedList and OrderedList. So I create an internal wrapper */
    Button: {
      baseStyle: {
        ...commonButtonBaseStyle,
      },
      defaultProps: {
        colorScheme: "red",
        variant: "solid",
      },
    },
    CloseButton: {
      baseStyle: {
        ...commonButtonBaseStyle,
      },
    },
    Code: {
      baseStyle: {
        ...sharedInlineStyles,
      },
    },
    Link: {
      baseStyle: {
        _hover: {
          textDecoration: "var(--ifm-link-hover-decoration)",
        },
        color: "var(--ifm-link-color)",
      },
    },
    Steps,
  },
  layerStyles: {
    hover: {
      _hover: {
        boxShadow: Styles.boxShadowMin,
      },
    },
  },
  styles: {
    global: {
      body: {
        lineHeight: 1.75,
      },
      // ol: {
      // background: "black",
      // },
      // Certain Docusaurus styles are on all pages (e.g., the navigation bar).
      // Declare a CSS-cr (below) if these styles cause a conflict with
      // Chakra
    },
  },
});

interface RootProps {
  children: React.ReactNode;
}

function Root({ children }: RootProps): JSX.Element {
  // Boolean is leveraged to pass Chakra theme to pages that primarily leverage
  // Chakra
  createLogger()
    .setGlobalContext({ logicPath: __filename })
    .logInnerStartExecution({ functionName: Root.name });

  return (
    <>
      {/*
       Certain Docusaurus functionality/styles needs to be present on all pages (e.g., navbar).
       set resetCSS=false to prevent Chakra from clobbering docusaurus styles
       https://github.com/chakra-ui/chakra-ui/issues/2802#issuecomment-1186287297
       https://stackoverflow.com/questions/72397539/docusaurus-wrapping-custom-root-in-chakraprovider-breaks-my-mdx-pages
       */}
      <ChakraProvider resetCSS={false} theme={customTheme}>
        <DependencyProvider
          dependencies={{
            ...dependencyProviderDependencies,
          }}
        >
          {children}
        </DependencyProvider>
      </ChakraProvider>
    </>
  );
}

// Docusaurus assumes this component leverages a default export
export default Root;
