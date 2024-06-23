import { tutorialConfigConst } from "@blockbash/common";
import {
  CardBody,
  CardHeader,
  Show,
  Spacer,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { Card } from "@components";
import { useDependencies } from "@hooks";
import { Styles } from "@src/css";
import { CategoryClear } from "@src/features/tutorial-selection/components/CategoryClear";
import { Filter } from "@src/features/tutorial-selection/components/Filter";
import { FilterMode } from "@src/features/tutorial-selection/components/FilterMode";
import { SearchBar } from "@src/features/tutorial-selection/components/SearchBar";
import {
  queryStringConst,
  type queryStringTypes,
  type tutorialConfigTypes,
} from "@utils";
import React from "react";

interface FilterCardProps {
  filterOperator: queryStringConst.FilterOptions;
  searchedTutorialName: queryStringTypes.TutorialSearchText;
  selectedTutorialCategories: tutorialConfigTypes.TutorialCategoryGUIDs;
  selectedTutorialTypes: tutorialConfigTypes.TutorialTypeGUIDs;
}

export function FilterCard(props: FilterCardProps): JSX.Element {
  const deps = useDependencies();
  const {
    filterOperator,
    searchedTutorialName,
    selectedTutorialCategories,
    selectedTutorialTypes,
  } = props;
  return (
    <Card
      boxShadow={Styles.boxShadowMed}
      id={tutorialConfigConst.AnchorGUID.tutorialSearch}
      variant="filled"
    >
      <CardHeader pb={0}>
        <Wrap justify="center" spacing={5}>
          <WrapItem alignItems="center">
            <SearchBar searchValue={searchedTutorialName} />
          </WrapItem>
          {/* 375 is device wrapping point in Chrome dev tools */}
          <Show ssr={true} breakpoint="(min-width: 376px)">
            <Spacer />
          </Show>
          <WrapItem>
            <FilterMode mode={filterOperator} />
          </WrapItem>
        </Wrap>
      </CardHeader>
      <CardBody>
        <Filter
          filterGroup={deps.tutorialConfig.getActiveContentTypes()}
          queryStringKey={queryStringConst.QueryStringKey.tutorialTypes}
          selectedGUIDs={selectedTutorialTypes}
          title="Content Types"
        />
        <Filter
          filterGroup={deps.tutorialConfig.getActiveContentCategories()}
          queryStringKey={queryStringConst.QueryStringKey.tutorialCategories}
          selectedGUIDs={selectedTutorialCategories}
          title="Content Categories"
        />
        <CategoryClear />
      </CardBody>
    </Card>
  );
}
