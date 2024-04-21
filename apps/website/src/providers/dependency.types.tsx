import {
  type Env,
  type TutorialsConfigOrchestrator,
} from "@blockbash/common"
import { type CreateLogger } from "@src/utils/logger.types"
import { type Data } from "@src/utils/data"
import { type Navigation } from "@src/utils/navigation"
import { type QueryString } from "@src/utils/queryString"
import { type ReactNode } from "react"

interface DependencyProviderDependencies {
  createLogger: CreateLogger;
  data: Data;
  env: Env;
  navigation: Navigation;
  queryString: QueryString;
  tutorialConfig: TutorialsConfigOrchestrator;
}

interface DependencyProps {
  children: ReactNode;
  dependencies: DependencyProviderDependencies;
}

export type { DependencyProps, DependencyProviderDependencies }
