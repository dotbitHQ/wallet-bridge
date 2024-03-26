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
  const { shadowDomElement } = getShadowDomRoot()

  if (shadowDomElement.getElementById(rootId) !== null) {
    portalRoot = shadowDomElement.getElementById(rootId)
    if (className && portalRoot !== null) {
      portalRoot.className = className
    }
  } else {
    const divDOM = document.createElement('div')
    divDOM.id = rootId
    shadowDomElement.appendChild(divDOM)
    portalRoot = divDOM
    if (className) {
      portalRoot.className = className
    }
  }

  useEffect(
    () => () => {
      if (portalRoot) {
        shadowDomElement?.removeChild(portalRoot)
      }
    },
    [portalRoot, shadowDomElement],
  )

  return createPortal(children, portalRoot as HTMLElement)
}
