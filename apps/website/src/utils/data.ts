import type Fuse from "fuse.js"

import { type DataDependencies, type FuzzyResult } from "@src/utils/data.types"

class Data {
  private readonly fuzzySearch: Fuse<string>

  // @ts-ignore
  // For whatever reason, typescript is complaining about logger but there is a this.logger reference in the class.
  private logger: DataDependencies["logger"]

  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: DataDependencies
  })
  {
    this.logger = injectedDependencies.logger.setGlobalContext({
      className: Data.name,
      logicPath: __filename,
    })
    // eslint-disable-next-line new-cap
    this.fuzzySearch = new injectedDependencies.fuzzySearchLib([], {
      includeScore: true,
    })
  }

  getFalseyFuzzyMatch(): FuzzyResult {
    // fuzzyRanking of 1 is a perfect mismatch
    return {fuzzyRanking: 1, isFuzzyMatch: false}
  }

  getFuzzyMatch({
    searchText,
    sourceText,
  }: {
    searchText: string
    sourceText: string
  }): FuzzyResult {
    // Replace all non-alphanumeric characters with spaces
    // (this aids the fuzzy search)
    const scrubbedSearchText = searchText.replace(/[\W_]+/g, " ")
    this.fuzzySearch.setCollection([sourceText])
    const results = this.fuzzySearch.search(scrubbedSearchText)

    let fuzzyRanking: number
    let isFuzzyMatch: boolean

    // Score/fuzzyRanking of 0 is a perfect match
    // Score/fuzzyRanking of 1 is a perfect mismatch
    if (typeof results[0]?.score === "undefined") {
      fuzzyRanking = 1
      isFuzzyMatch = false
    } else {
      fuzzyRanking = results[0]?.score
      isFuzzyMatch = true
    }
    return {fuzzyRanking, isFuzzyMatch}
  }

  toLowerCase<T extends string>(data: T[]) {
    return data.map((value) => value.toLowerCase())
  }

  toggleListItem<T>(list: T[], item: T): T[] {
    const itemIndex = list.indexOf(item)
    if (itemIndex === -1) {
      return list.concat(item)
    }
    const newList = [...list]
    newList.splice(itemIndex, 1)
    return newList
  }
}

export { Data }
