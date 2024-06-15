import { type loggerTypes } from "@blockbash/common";
import { Flex, Stack } from "@chakra-ui/react";
import { useLocation } from "@docusaurus/router";
import { type Dependencies, useDependencies } from "@hooks";
import { type TutorialsWithFuzzyResult } from "@src/features/tutorial-selection/components/TutorialSelection.types";
import {
  type dataTypes,
  type navigationTypes,
  queryStringConst,
  type queryStringTypes,
  type tutorialConfigTypes,
} from "@utils";
import React, { useEffect, useState } from "react";

import { FilterCard } from "./FilterCard";
import { Header } from "./Header";
import { Playlists } from "./Playlists";
import { ResultCards } from "./ResultCards";

function isSelectableFilterMatch({
  selectedFilterOperator,
  selectedTutorialCategories,
  selectedTutorialTypes,
  tutorialCategories,
  tutorialType,
}: {
  selectedFilterOperator: queryStringConst.FilterOptions;
  selectedTutorialCategories: tutorialConfigTypes.TutorialCategoryGUIDs;
  selectedTutorialTypes: tutorialConfigTypes.TutorialTypeGUIDs;
  tutorialCategories: tutorialConfigTypes.TutorialCategoryGUIDs;
  tutorialType: tutorialConfigTypes.TutorialTypeGUID;
}): boolean {
  if (
    selectedFilterOperator.toLowerCase() ===
    queryStringConst.FilterOptions.AND.toLowerCase()
  ) {
    const containsCorrectCategories = selectedTutorialCategories.every(
      (selectedTutorialCategoryGUID) =>
        tutorialCategories.includes(
          selectedTutorialCategoryGUID.toLowerCase() as tutorialConfigTypes.TutorialCategoryGUID,
        ),
    );
    const containsCorrectTypes = selectedTutorialTypes.every(
      (selectedTutorialTypeGUID) =>
        tutorialType.toLowerCase() === selectedTutorialTypeGUID.toLowerCase(),
    );

    return containsCorrectTypes && containsCorrectCategories;
  }
  // Leverage an OR-based search
  const containsCorrectCategories = selectedTutorialCategories.some(
    (selectedTutorialCategoryGUID) =>
      tutorialCategories.includes(
        selectedTutorialCategoryGUID.toLowerCase() as tutorialConfigTypes.TutorialCategoryGUID,
      ),
  );
  const containsCorrectContentTypes = selectedTutorialTypes.some(
    (type) => tutorialType.toLowerCase() === type.toLowerCase(),
  );
  return containsCorrectCategories || containsCorrectContentTypes;
}

function sortTutorials(tutorials: TutorialsWithFuzzyResult) {
  return tutorials.sort((a, b) => a.fuzzyRanking - b.fuzzyRanking);
}

function filterTutorials({
  allTutorials,
  deps,
  logger,
  searchedTutorialName,
  selectedFilterOperator,
  selectedTutorialCategories,
  selectedTutorialTypes,
}: {
  allTutorials: tutorialConfigTypes.Tutorials;
  deps: Dependencies;
  logger: loggerTypes.ILoggerMin;
  searchedTutorialName: queryStringTypes.TutorialSearchText;
  selectedFilterOperator: queryStringConst.FilterOptions;
  selectedTutorialCategories: tutorialConfigTypes.TutorialCategoryGUIDs;
  selectedTutorialTypes: tutorialConfigTypes.TutorialTypeGUIDs;
}): TutorialsWithFuzzyResult {
  const selectableFilterGUIDs = [
    ...selectedTutorialTypes,
    ...selectedTutorialCategories,
  ];

  // If nothing is selected (i.e., filtered) we show all tutorials
  if (selectableFilterGUIDs.length === 0 && searchedTutorialName.length === 0) {
    return allTutorials.map((tutorial) => ({
      ...tutorial,
      ...deps.data.getFalseyFuzzyMatch(),
    }));
  }

  return allTutorials.flatMap((tutorial) => {
    const selectableFilterMatch = isSelectableFilterMatch({
      selectedFilterOperator,
      selectedTutorialCategories,
      selectedTutorialTypes,
      tutorialCategories: deps.tutorialConfig.getTutorialCategoryGUIDs(
        tutorial.guid,
      ),
      tutorialType: deps.tutorialConfig.getTutorialTypeGUID(tutorial.guid),
    });

    let isTutorialNameMatch: boolean;
    let fuzzyResult: dataTypes.FuzzyResult;
    if (searchedTutorialName.length > 0) {
      fuzzyResult = deps.data.getFuzzyMatch({
        searchText: searchedTutorialName,
        sourceText: tutorial.name,
      });
      isTutorialNameMatch = fuzzyResult.isFuzzyMatch;
    } else {
      isTutorialNameMatch = false;
      fuzzyResult = deps.data.getFalseyFuzzyMatch();
    }

    let isMatch: boolean;
    if (
      selectedFilterOperator.toLowerCase() ===
      queryStringConst.FilterOptions.AND.toLowerCase()
    ) {
      if (searchedTutorialName.length > 0) {
        isMatch = selectableFilterMatch && isTutorialNameMatch;
      } else {
        isMatch = selectableFilterMatch;
      }
    } else if (
      selectedFilterOperator.toLowerCase() ===
      queryStringConst.FilterOptions.OR.toLowerCase()
    ) {
      if (searchedTutorialName.length > 0) {
        isMatch = selectableFilterMatch || isTutorialNameMatch;
      } else {
        isMatch = selectableFilterMatch;
      }
    } else {
      logger.warn({
        functionName: filterTutorials.name,
        message:
          "selectedFilterOperator has unexpected value.  Defaulting isMatch === true",
        metadata: { selectedFilterOperator },
      });
      isMatch = true;
    }
    if (isMatch) {
      return [{ ...tutorial, ...fuzzyResult }];
    }
    // #FlatMap ignores [] entries
    return [];
  });
}

function TutorialSelection(): JSX.Element {
  const deps = useDependencies();
  const logger = deps
    .createLogger()
    .setGlobalContext({ logicPath: __filename });
  const location = useLocation<navigationTypes.NavigationPositionState>();
  const [selectedFilterOperator, setSelectedFilterOperator] =
    useState<queryStringConst.FilterOptions>(queryStringConst.FilterOptions.OR);
  const [selectedTutorialCategories, setSelectedTutorialCategories] =
    useState<tutorialConfigTypes.TutorialCategoryGUIDs>([]);
  const [selectedTutorialTypes, setSelectedTutorialTypes] =
    useState<tutorialConfigTypes.TutorialTypeGUIDs>([]);
  const [searchedTutorialName, setSearchedTutorialName] =
    useState<queryStringTypes.TutorialSearchText>("");

  useEffect(() => {
    logger.logInnerStartExecution({
      functionName: `${TutorialSelection.name}.${useEffect.name}`,
    });
    const queryStringResults = {
      tutorialCategories: deps.queryString.getTutorialCategoryGUIDs(),
      tutorialFilterOperator: deps.queryString.getTutorialFilterOperator(),
      tutorialName: deps.queryString.getTutorialSearchInput(),
      tutorialTypes: deps.queryString.getTutorialTypeGUIDs(),
    };
    setSelectedTutorialCategories(queryStringResults.tutorialCategories);
    setSelectedTutorialTypes(queryStringResults.tutorialTypes);
    setSelectedFilterOperator(queryStringResults.tutorialFilterOperator);
    setSearchedTutorialName(queryStringResults.tutorialName);
  }, [location.search]);

  logger.logOuterStartExecution({
    functionName: `${TutorialSelection.name}.${filterTutorials.name}`,
    metadata: { locationSearch: location.search },
  });

  const tutorials = sortTutorials(
    filterTutorials({
      allTutorials: deps.tutorialConfig.getTutorials(),
      deps,
      logger,
      searchedTutorialName,
      selectedFilterOperator,
      selectedTutorialCategories,
      selectedTutorialTypes,
    }),
  );
  logger.logOuterFinishedExecution({
    functionName: `${TutorialSelection.name}.${filterTutorials.name}`,
    metadata: { tutorials },
  });

  return (
    <>
      <Flex
        alignItems="center"
        backgroundColor={"gray.50"}
        flexDirection="column"
        pb={5}
        wrap="wrap"
      >
        <Header />
      </Flex>
      <Flex alignItems="center" flexDirection="column" wrap="wrap">
        <Playlists />
      </Flex>

      <Flex flexDirection="column" maxW="3xl" mt={16} mx="auto">
        <Stack mb={4} spacing={4}>
          <FilterCard
            filterOperator={selectedFilterOperator}
            searchedTutorialName={searchedTutorialName}
            selectedTutorialCategories={selectedTutorialCategories}
            selectedTutorialTypes={selectedTutorialTypes}
          />
          <ResultCards tutorials={tutorials} />
        </Stack>
      </Flex>
    </>
  );
}

export { TutorialSelection };
