import { type loggerTypes } from "@blockbash/common";

import { QueryString } from "./queryString";
import { type QueryStringKey } from "./queryString.const";

type TutorialSearchText = string;
type QueryStringFilterGroupKey =
  | QueryStringKey.tutorialCategories
  | QueryStringKey.tutorialTypes;

interface QueryStringDependencies {
  logger: loggerTypes.ILoggerBase;
}

export {
  QueryString,
  type QueryStringDependencies,
  type QueryStringFilterGroupKey,
  type TutorialSearchText,
};
