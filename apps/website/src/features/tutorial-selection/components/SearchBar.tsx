import { SearchIcon } from "@chakra-ui/icons";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useHistory, useLocation } from "@docusaurus/router";
import { useDependencies } from "@hooks";
import { Styles } from "@src/css";
import {
  type navigationTypes,
  queryStringConst,
  type queryStringTypes,
} from "@utils";
import React from "react";

interface SearchBarProps {
  searchValue: queryStringTypes.TutorialSearchText;
}

export function SearchBar(props: SearchBarProps) {
  const history = useHistory<navigationTypes.NavigationPositionState>();
  const location = useLocation<navigationTypes.NavigationPositionState>();
  const deps = useDependencies();
  const logger = deps
    .createLogger()
    .setGlobalContext({ logicPath: __filename })
    .logInnerStartExecution({
      functionName: `${SearchBar.name}`,
    });
  const { searchValue } = props;

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    logger.logInnerStartExecution({
      functionName: `${SearchBar.name}.${onInputChange.name}`,
    });
    const newSearchParams = deps.queryString.replaceParam({
      key: queryStringConst.QueryStringKey.tutorialName,
      value: e.currentTarget.value,
    });
    deps.navigation.updateHistory({
      history,
      location,
      searchParams: newSearchParams,
    });
  };

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <SearchIcon boxSize={4} />
      </InputLeftElement>
      <Input
        // For whatever reason, I cant apply the hover layerStyle to
        // an Input component
        _hover={{ boxShadow: "outline" }}
        _placeholder={{
          color: "blackAlpha.900",
        }}
        bg="whiteAlpha.900"
        borderColor={Styles.borderColorMed}
        borderRadius="full"
        boxShadow="lg"
        // Reset docusaurus style
        boxSizing="unset"
        // Need to specify unique id (within loaded page)
        // to make restoreNavigationState work
        id={`${SearchBar.name}-search-tutorial-names-filter`}
        onInput={onInputChange}
        placeholder="Search Tutorial Names"
        size="sm"
        value={searchValue}
        width="min-content"
      />
    </InputGroup>
  );
}
