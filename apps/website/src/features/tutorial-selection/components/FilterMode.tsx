import { Tab, TabList, Tabs, Text, VStack } from "@chakra-ui/react";
import { useHistory, useLocation } from "@docusaurus/router";
import { useDependencies } from "@hooks";
import { Styles } from "@src/css";
import { type navigationTypes, queryStringConst } from "@utils";
import React from "react";

interface FilterModeProps {
  mode: queryStringConst.FilterOptions;
}

// Corresponds to the index order in the tabElements array
function getIndex(mode: queryStringConst.FilterOptions) {
  if (mode.toLowerCase() === queryStringConst.FilterOptions.OR.toLowerCase()) {
    return 0;
  }
  return 1;
}

export function FilterMode(props: FilterModeProps) {
  const { mode } = props;
  const location = useLocation<navigationTypes.NavigationPositionState>();
  const history = useHistory<navigationTypes.NavigationPositionState>();
  const deps = useDependencies();
  const logger = deps
    .createLogger()
    .setGlobalContext({ logicPath: __filename })
    .logInnerStartExecution({
      functionName: `${FilterMode.name}`,
      metadata: { mode },
    });

  const onFilterChange = (filterMode: queryStringConst.FilterOptions) => {
    logger.logInnerStartExecution({
      functionName: `${onFilterChange.name}`,
      metadata: { mode: filterMode },
    });
    const searchParams = deps.queryString.replaceParam({
      key: queryStringConst.QueryStringKey.tutorialFilterMode,
      value: filterMode,
    });

    deps.navigation.updateHistory({
      history,
      location,
      searchParams,
    });
  };
  // Ordering of FilterOptions array corresponds to the indices within
  // onFilterChange
  const tabElements = [
    queryStringConst.FilterOptions.OR,
    queryStringConst.FilterOptions.AND,
  ].map((filterMode) => (
    <Tab
      border="1px"
      borderColor={Styles.borderColorMin}
      key={filterMode}
      layerStyle="hover"
      onClick={() => {
        onFilterChange(filterMode);
      }}
    >
      {filterMode}
    </Tab>
  ));

  return (
    <VStack
      align="flex-start"
      border="1px"
      borderColor={Styles.borderColorMin}
      borderRadius={20}
      // Unset will revert docusaurus styling conflict
      boxSizing="unset"
      padding={2}
      spacing={0}
    >
      <Text fontSize="sm" mb={1} mx="auto">
        Filter Mode
      </Text>
      <Tabs index={getIndex(mode)} size="sm" variant="soft-rounded">
        <TabList>{tabElements}</TabList>
      </Tabs>
    </VStack>
  );
}
