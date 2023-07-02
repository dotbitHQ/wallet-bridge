import { ReactElement, ReactNode, cloneElement, createContext, useCallback, useContext, useMemo, useState } from 'react'
import { Header } from '../Header'
import { SwapTransition } from '../SwapTransition'

interface Route {
  el: ReactElement
  next?: string
  prev?: string
}

interface SimpleRouterProps {
  initialRouteName: string
  routes: Record<string, Route | undefined>
  onClose: () => void
}

const routerContext = createContext<{
  currentRouteName: string
  prevRouteName?: string
  goNext?: () => void
  goBack?: () => void
  goTo: (routeName: string) => void
  onClose: () => void
} | null>(null)

export function useSimpleRouter() {
  return useContext(routerContext)
}

export function SimpleRouter({ routes, onClose, initialRouteName = 'index' }: SimpleRouterProps) {
  const history: string[] = useMemo(() => [], [])
  const [currentRouteName, setCurrentRouteName] = useState(initialRouteName)

  const currentRoute = routes[currentRouteName]
  if (currentRoute === undefined) throw new Error('Route does not exist')
  const goNext = currentRoute.next
    ? () => {
        history.push(currentRouteName)
        setCurrentRouteName(currentRoute.next!)
      }
    : undefined
  const goBack =
    history.length > 0 || currentRoute.prev
      ? () => {
          const prevRoute = history.pop()
          if (prevRoute) setCurrentRouteName(prevRoute)
          else if (currentRoute.prev) setCurrentRouteName(currentRoute.prev)
        }
      : undefined
  const goTo = useCallback(
    (routeName: string) => {
      history.push(currentRouteName)
      setCurrentRouteName(routeName)
    },
    [setCurrentRouteName, currentRouteName, history],
  )
  return (
    <routerContext.Provider
      value={{
        currentRouteName,
        prevRouteName: history[history.length - 1],
        goNext,
        goBack,
        goTo,
        onClose,
      }}
    >
      <SwapTransition>
        <div className="w-full" key={currentRouteName}>
          {currentRoute.el}
        </div>
      </SwapTransition>
    </routerContext.Provider>
  )
}
