import { type dataTypes, type tutorialConfigTypes } from "@utils"

type TutorialWithFuzzyResult = dataTypes.FuzzyResult &
  tutorialConfigTypes.Tutorial
type TutorialsWithFuzzyResult = TutorialWithFuzzyResult[]

export type { TutorialWithFuzzyResult, TutorialsWithFuzzyResult }
