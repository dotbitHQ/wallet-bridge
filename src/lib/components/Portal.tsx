import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  children: ReactNode
  customRootId?: string
  className?: string
}

export function Portal({ children, customRootId, className }: PortalProps) {
  let portalRoot: HTMLElement | null = null
  const rootId = customRootId ?? 'portal-root'

  if (document.getElementById(rootId) !== null) {
    portalRoot = document.getElementById(rootId)
    if (className && portalRoot !== null) {
      portalRoot.className = className
    }
  } else {
    const divDOM = document.createElement('div')
    divDOM.id = rootId
    document.body.appendChild(divDOM)
    portalRoot = divDOM
    if (className) {
      portalRoot.className = className
    }
  }

  useEffect(
    () => () => {
      portalRoot?.parentElement?.removeChild(portalRoot)
    },
    [portalRoot],
  )

  return createPortal(children, portalRoot as HTMLElement)
}
