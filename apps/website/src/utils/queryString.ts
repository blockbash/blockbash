import { type tutorialConfigTypes } from "@blockbash/common"
import { FilterOptions, QueryStringKey } from "@src/utils/queryString.const"
import {
  type QueryStringDependencies,
  type QueryStringFilterGroupKey,
  type TutorialSearchText,
} from "@src/utils/queryString.types"

class QueryString {
  private readonly logger: QueryStringDependencies["logger"]

  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: QueryStringDependencies;
  })
  {
    this.logger = injectedDependencies.logger.setGlobalContext({
      className: QueryString.name,
      logicPath: __filename,
    })
  }

  private static deleteParams({keys}: {
    keys: QueryStringKey[]
  })
  {
    const urlParams = QueryString.getRawParams()
    keys.forEach((key) => {
      urlParams.delete(key)
    })
    return urlParams
  }

  private static getParam(key: QueryStringKey) {
    const param = QueryString.getRawParams().get(key)
    if (param) {
      return param.toLowerCase()
    }
    return param
  }

  private static getParams(key: QueryStringKey) {
    const param = QueryString.getRawParams().getAll(key)
    return param.map((value) => value.toLowerCase())
  }

  private static getRawParams() {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search)
    }
    return new URLSearchParams()
  }

  getActiveFilters() {
    return [
      this.getTutorialSearchInput(),
      ...this.getTutorialTypeGUIDs(),
      ...this.getTutorialCategoryGUIDs(),
    ].filter((value) => value)
  }

  getTutorialCategoryGUIDs(): tutorialConfigTypes.TutorialCategoryGUIDs {
    const categoryGUIDs = QueryString.getParams(
      QueryStringKey.tutorialCategories,
    ) as tutorialConfigTypes.TutorialCategoryGUIDs
    this.logger.logInnerFinishedExecution({
      functionName: this.getTutorialCategoryGUIDs.name,
      metadata: {categoryGUIDs},
    })
    return categoryGUIDs
  }

  getTutorialFilterOperator(): FilterOptions {
    const filterMode = (QueryString.getParam(
      QueryStringKey.tutorialFilterMode,
    ) || FilterOptions.OR) as FilterOptions
    this.logger.logInnerFinishedExecution({
      functionName: this.getTutorialFilterOperator.name,
      metadata: {filterMode},
    })

    return filterMode
  }

  getTutorialSearchInput(): TutorialSearchText {
    const searchInput = QueryString.getParam(QueryStringKey.tutorialName) || ""
    this.logger.logInnerFinishedExecution({
      functionName: this.getTutorialSearchInput.name,
      metadata: {searchedText: searchInput},
    })
    return searchInput
  }

  getTutorialTypeGUIDs(): tutorialConfigTypes.TutorialTypeGUIDs {
    const typeGUIDs = QueryString.getParams(
      QueryStringKey.tutorialTypes,
    ) as tutorialConfigTypes.TutorialTypeGUIDs
    this.logger.logInnerFinishedExecution({
      functionName: this.getTutorialTypeGUIDs.name,
      metadata: {typeGUIDs},
    })
    return typeGUIDs
  }

  replaceParam({key, value}: {
    key: QueryStringKey;
    value: string
  })
  {
    const urlParams = QueryString.deleteParams({keys: [key]})
    urlParams.set(key, value)
    return urlParams
  }

  replaceSelectableFilterValue({
    key,
    value,
  }: {
    key: QueryStringFilterGroupKey;
    value: tutorialConfigTypes.TutorialSelectableFilterGUIDs;
  })
  {
    const urlParams = QueryString.deleteParams({keys: [key]})
    value.forEach((guid) => {
      urlParams.append(key, guid)
    })
    return urlParams
  }

  resetFilters() {
    const filters = Object.values(QueryStringKey).filter(
      (value) => value !== QueryStringKey.tutorialFilterMode,
    )
    return QueryString.deleteParams({keys: filters})
  }
}

export { QueryString, type QueryStringDependencies }
