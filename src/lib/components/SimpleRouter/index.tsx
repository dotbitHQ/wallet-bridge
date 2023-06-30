import { ReactElement, ReactNode, cloneElement, createContext, useCallback, useContext, useState } from 'react'
import { Header } from '../Header'
import { SwapTransition } from '../SwapTransition'

interface Route {
  title: string
  el: ReactElement
  next?: string
  prev?: string
}

interface SimpleRouterProps {
  initialRouteName: string
  routes: {
    index: Route
    [k: string]: Route | undefined
  }
  onClose: () => void
}

type State = any
type StateTransition<T> = (state?: T) => T

const routerContext = createContext<{
  currentRouteName: string
  goNext?: (stateTransition?: StateTransition<any>) => void
  goBack?: (stateTransition?: StateTransition<any>) => void
  goTo: (routeName: string, state: State) => void
  state: State
  setState: React.Dispatch<State>
} | null>(null)

export function useSimpleRouter<T>() {
  return useContext<{
    currentRouteName: string
    goNext?: (stateTransition?: StateTransition<T>) => void
    goBack?: (stateTransition?: StateTransition<T>) => void
    goTo: (routeName: string, state: State) => void
    state: State
    setState: React.Dispatch<State>
  } | null>(routerContext)
}

export function SimpleRouter<T>({ routes, onClose, initialRouteName = 'index' }: SimpleRouterProps) {
  const [currentRouteName, setCurrentRouteName] = useState(initialRouteName)
  const [globalState, setGlobalState] = useState<T>()

  const currentRoute = routes[currentRouteName]
  if (!currentRoute) throw new Error('Route does not exist')
  const goNext = useCallback(
    (stateTransition?: StateTransition<T>) => {
      if (stateTransition) setGlobalState(stateTransition(globalState))
      currentRoute.next && setCurrentRouteName(currentRoute.next)
    },
    [currentRoute.next, setGlobalState],
  )
  const goBack = useCallback(
    (stateTransition?: StateTransition<T>) => {
      if (stateTransition) setGlobalState(stateTransition(globalState))
      currentRoute.prev && setCurrentRouteName(currentRoute.prev)
    },
    [currentRoute.prev, setGlobalState],
  )
  const goTo = useCallback((routeName: string) => setCurrentRouteName(routeName), [setCurrentRouteName])
  return (
    <routerContext.Provider
      value={{
        currentRouteName,
        goNext: currentRoute.next ? goNext : undefined,
        goBack: currentRoute.prev ? goBack : undefined,
        goTo,
        state: globalState,
        setState: setGlobalState,
      }}
    >
      <SwapTransition>
        <div key={currentRouteName}>
          <Header title={currentRoute.title} onClose={onClose} goBack={goBack} />
          {currentRoute.el}
        </div>
      </SwapTransition>
    </routerContext.Provider>
  )
}
