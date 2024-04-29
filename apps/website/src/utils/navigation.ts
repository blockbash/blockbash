import { type useHistory, type useLocation } from "@docusaurus/router"
import { type navigationTypes } from "@utils"

type History = ReturnType<
  typeof useHistory<navigationTypes.NavigationPositionState>
>;
type Location = ReturnType<
  typeof useLocation<navigationTypes.NavigationPositionState>
>;

class Navigation {
  private readonly logger: navigationTypes.NavigationDependencies["logger"]

  constructor({
    injectedDependencies,
  }: {
    injectedDependencies: navigationTypes.NavigationDependencies;
  })
  {
    this.logger = injectedDependencies.logger.setGlobalContext({
      className: Navigation.name,
      logicPath: __filename,
    })
  }

  private getPositionState(): navigationTypes.NavigationPositionState {
    let state: navigationTypes.NavigationPositionState

    if (typeof window !== "undefined" && typeof document !== "undefined") {
      state = {
        focusedElementId: document.activeElement?.id,
        scrollTopPosition: window.scrollY,
      }
    } else {
      state = undefined
    }
    return state
  }

  // Docs suggest passing location object and not leveraging history.location
  // https://v5.reactrouter.com/web/api/history/history-is-mutable

  // On initial render navigationState is undefined
  restoreNavigationState({
    navigationState,
  }: {
    navigationState: navigationTypes.NavigationPositionState;
  }): void
  {
    const {focusedElementId, scrollTopPosition} = navigationState ?? {
      focusedElementId: undefined,
      scrollTopPosition: 0,
    }
    this.logger.logInnerStartExecution({
      functionName: this.restoreNavigationState.name,
      metadata: {focusedElementId, scrollTopPosition},
    })
    if (focusedElementId) {
      document.getElementById(focusedElementId)?.focus()
    }
    window.scrollTo({top: scrollTopPosition})
  }

  // Leveraged for updating the URL and/or general navigation
  updateHistory({
    history,
    location,
    searchParams,
  }: {
    history: History;
    location: Location;
    searchParams: URLSearchParams;
  }): void
  {
    // Override parts of Location object with updated .search/.state
    const newLocation = {
      ...location,
      search: searchParams.toString(),
      state: this.getPositionState(),
    }

    history.push(newLocation)
  }
}

export { Navigation }
