import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { getShadowDomRoot } from '../utils'

interface PortalProps {
  children: ReactNode
  customRootId?: string
  className?: string
}

export function Portal({ children, customRootId, className }: PortalProps) {
  let portalRoot: HTMLElement | null = null
  const rootId = customRootId ?? 'portal-root'
  const shadowDomRoot = getShadowDomRoot()

  if (shadowDomRoot.getElementById(rootId) !== null) {
    portalRoot = shadowDomRoot.getElementById(rootId)
    if (className && portalRoot !== null) {
      portalRoot.className = className
    }
  } else {
    const divDOM = document.createElement('div')
    divDOM.id = rootId
    shadowDomRoot.appendChild(divDOM)
    portalRoot = divDOM
    if (className) {
      portalRoot.className = className
    }
  }

  useEffect(
    () => () => {
      if (portalRoot) {
        shadowDomRoot?.removeChild(portalRoot)
      }
    },
    [portalRoot, shadowDomRoot],
  )

  return createPortal(children, portalRoot as HTMLElement)
}
