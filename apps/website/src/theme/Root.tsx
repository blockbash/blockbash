import { ChakraProvider, extendTheme } from "@chakra-ui/react"
import useIsBrowser from "@docusaurus/useIsBrowser"
import { Styles } from "@src/css"
import { dependencyProviderDependencies } from "@src/providers/dependency"
import { DependencyProvider, createLogger } from "@utils"
import React from "react"

const defaultTheme = extendTheme()
const customTheme = extendTheme({
  layerStyles: {
    hover: {
      _hover: {
        boxShadow: Styles.boxShadowMin,
      },
    },
  },
  styles: {
    global: {
      // Certain Docusaurus styles are on all pages (e.g., the navigation bar).
      // Declare a CSS-reset (below) if these styles cause a conflict with
      // Chakra
      a: {
        _hover: {
          color: "unset",
          textDecoration: "unset",
        },
      },
    },
  },
})

interface RootProps {
  children: React.ReactNode;
}

function Root({children}: RootProps) {
  // Boolean is leveraged to pass Chakra theme to pages that primarily leverage
  // Chakra
  const isBrowser = useIsBrowser()
  const isPrimaryChakraPage = isBrowser
    ? window.location.pathname === "/"
    : true
  createLogger()
    .setGlobalContext({logicPath: __filename})
    .logInnerStartExecution({functionName: Root.name})

  return (
    <>
      {/*
       Certain Docusaurus functionality/styles needs to be present on all pages (e.g., navbar).
       set resetCSS=false to prevent Chakra from clobbering docusaurus styles
       https://github.com/chakra-ui/chakra-ui/issues/2802#issuecomment-1186287297
       https://stackoverflow.com/questions/72397539/docusaurus-wrapping-custom-root-in-chakraprovider-breaks-my-mdx-pages
       */}
      <ChakraProvider
        resetCSS={false}
        theme={isPrimaryChakraPage ? customTheme : defaultTheme}
      >
        <DependencyProvider
          dependencies={{
            ...dependencyProviderDependencies,
          }}
        >
          {children}
        </DependencyProvider>
      </ChakraProvider>
    </>
  )
}

// Docusaurus assumes this component leverages a default export
export default Root
