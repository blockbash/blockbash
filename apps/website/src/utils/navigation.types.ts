import { type loggerTypes } from "@blockbash/common"

interface NavigationDependencies {
  logger: loggerTypes.ILoggerBase
}

interface INavigationPositionState {
  focusedElementId: string | undefined
  scrollTopPosition: number
}

type NavigationPositionState = INavigationPositionState | undefined

export type { NavigationDependencies, NavigationPositionState }
