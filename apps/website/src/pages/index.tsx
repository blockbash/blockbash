import { Box } from "@chakra-ui/react"
import { useLocation } from "@docusaurus/router"
import useDocusaurusContext from "@docusaurus/useDocusaurusContext"
import { TutorialSelection } from "@features"
import { useDependencies } from "@hooks"
import Layout from "@theme/Layout"
import { type navigationTypes } from "@utils"
import React, { useEffect } from "react"

function Homepage() {
  const deps = useDependencies()
  const {siteConfig} = useDocusaurusContext()
  const location = useLocation<navigationTypes.NavigationPositionState>()
  const logger = deps
    .createLogger()
    .setGlobalContext({logicPath: __filename})
    .logInnerStartExecution({functionName: Homepage.name})
  useEffect(() => {
    logger.logInnerStartExecution({
      functionName: `${Homepage.name}.${useEffect.name}`,
      metadata: {location: location.state},
    })
    deps.navigation.restoreNavigationState({navigationState: location.state})
  }, [location.state])

  return (
    <Layout description={siteConfig.tagline} title={siteConfig.title}>
      <Box bg="blackAlpha.50">
        <TutorialSelection/>
      </Box>
    </Layout>
  )
}

// Docusaurus assumes this component leverages a default export
export default Homepage
