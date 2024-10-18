import { DepsContext } from "@src/providers/dependency";
import { type DependencyProviderDependencies } from "@src/providers/dependency.types";
import { useContext } from "react";

type Dependencies = DependencyProviderDependencies;

function useDependencies(): Dependencies {
  return useContext(DepsContext);
}

export { type Dependencies, useDependencies };
