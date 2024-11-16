import { type DependencyProps } from "@src/providers/dependency.types";
import {
  createLogger,
  data,
  env,
  navigation,
  queryString,
  tutorialConfig,
} from "@utils";
import React, { createContext } from "react";

const dependencyProviderDependencies = {
  createLogger,
  data,
  env,
  navigation,
  queryString,
  tutorialConfig,
};

const DepsContext = createContext(dependencyProviderDependencies);

function DependencyProvider({ children, dependencies }: DependencyProps) {
  dependencies
    .createLogger()
    .setGlobalContext({ logicPath: __filename })
    .logInnerStartExecution({ functionName: DependencyProvider.name });
  return (
    <DepsContext.Provider value={dependencies}>{children}</DepsContext.Provider>
  );
}

export { DependencyProvider, DepsContext, dependencyProviderDependencies };
