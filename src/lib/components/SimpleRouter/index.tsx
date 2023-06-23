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
  routes: {
    index: Route
    [k: string]: Route | undefined
  }
  onClose: () => void
}

const routerContext = createContext<{
  currentRouteName: string
  goNext?: () => void
  goBack?: () => void
  state: any
  setState: React.Dispatch<any>
} | null>(null)

export function useSimpleRouter() {
  return useContext(routerContext)
}

export function SimpleRouter({ routes, onClose }: SimpleRouterProps) {
  const [currentRouteName, setCurrentRouteName] = useState('index')
  const [globalState, setGlobalState] = useState<any>()

  const currentRoute = routes[currentRouteName]
  if (!currentRoute) throw new Error('Route does not exist')
  const goNext = useCallback(() => currentRoute.next && setCurrentRouteName(currentRoute.next), [currentRoute.next])
  const goBack = useCallback(() => currentRoute.prev && setCurrentRouteName(currentRoute.prev), [currentRoute.prev])

  return (
    <routerContext.Provider
      value={{
        currentRouteName,
        goNext: currentRoute.next ? goNext : undefined,
        goBack: currentRoute.prev ? goBack : undefined,
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
