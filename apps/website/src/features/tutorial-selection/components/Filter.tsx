import { Wrap } from "@chakra-ui/react";
import { Divider } from "@components";
import { useHistory, useLocation } from "@docusaurus/router";
import { useDependencies } from "@hooks";
import {
  type navigationTypes,
  type queryStringTypes,
  type tutorialConfigTypes,
} from "@utils";
import React from "react";

import { FilterContentGroupTag } from "./FilterContentGroupTag";

interface FilterProps {
  filterGroup: tutorialConfigTypes.TutorialSelectableFiltersWithCount;
  queryStringKey: queryStringTypes.QueryStringFilterGroupKey;
  selectedGUIDs: tutorialConfigTypes.TutorialSelectableFilterGUIDs;
  title: string;
}

export function Filter(props: FilterProps) {
  // Hooks must be leveraged at the top of a React function component
  const history = useHistory<navigationTypes.NavigationPositionState>();
  const location = useLocation<navigationTypes.NavigationPositionState>();
  const deps = useDependencies();
  const { filterGroup, queryStringKey, selectedGUIDs, title } = props;
  const logger = deps
    .createLogger()
    .setGlobalContext({ logicPath: __filename })
    .logInnerStartExecution({
      functionName: `${Filter.name}`,
      metadata: props,
    });

  const handleFilterSelect = (
    GUID: tutorialConfigTypes.TutorialSelectableFilterGUID,
  ) => {
    logger.logInnerStartExecution({
      functionName: `${Filter.name}.${handleFilterSelect.name}`,
    });
    const newGUIDs = deps.data.toggleListItem(
      selectedGUIDs,
      GUID,
    ) as tutorialConfigTypes.TutorialSelectableFilterGUIDs;
    const searchParams = deps.queryString.replaceSelectableFilterValue({
      key: queryStringKey,
      value: newGUIDs,
    });
    deps.navigation.updateHistory({
      history,
      location,
      searchParams,
    });
  };

  return (
    <>
      <Divider title={title} />
      <Wrap justify="center" shouldWrapChildren>
        {filterGroup.map((category) => (
          <FilterContentGroupTag
            isActive={selectedGUIDs.includes(
              category.guid?.toLowerCase() as tutorialConfigTypes.TutorialSelectableFilterGUID,
            )}
            key={category.guid}
            name={`${category.name} (${category.count})`}
            onClick={() => {
              handleFilterSelect(category.guid);
            }}
          />
        ))}
      </Wrap>
    </>
  );
}
