import { Button } from "@chakra-ui/react"
import { useHistory, useLocation } from "@docusaurus/router"
import { useDependencies } from "@hooks"
import { type navigationTypes } from "@utils"
import React, { useCallback } from "react"

export function CategoryClear() {
  const deps = useDependencies()
  const history = useHistory<navigationTypes.NavigationPositionState>()
  const location = useLocation<navigationTypes.NavigationPositionState>()
  const isActive = deps.queryString.getActiveFilters().length > 0

  const logger = deps
    .createLogger()
    .setGlobalContext({logicPath: __filename})
    .logInnerStartExecution({
      functionName: `${CategoryClear.name}`,
      metadata: {isActive},
    })

  const handleFilterClear = useCallback(() => {
    logger.logInnerStartExecution({
      functionName: `${CategoryClear.name}.${handleFilterClear.name}`,
    })
    const newSearch = deps.queryString.resetFilters()
    deps.navigation.updateHistory({
      history,
      location,
      searchParams: newSearch,
    })
  }, [history, location])

  return (
    <Button
      _hover={{
        bg: "none",
      }}
      bg="none"
      border="none"
      color="primary"
      cursor="pointer"
      isDisabled={!isActive}
      onClick={() => {
        handleFilterClear()
      }}
      p={0}
      textDecoration="underline"
    >
      Clear filters
    </Button>
  )
}
