import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  children: ReactNode
  customRootId?: string
}

export function Portal({ children, customRootId }: PortalProps) {
  let portalRoot: HTMLElement | null = null
  const rootId = customRootId ?? 'portal-root'

  if (document.getElementById(rootId) !== null) {
    portalRoot = document.getElementById(rootId)
  } else {
    const divDOM = document.createElement('div')
    divDOM.id = rootId
    document.body.appendChild(divDOM)
    portalRoot = divDOM
  }

  useEffect(
    () => () => {
      portalRoot?.parentElement?.removeChild(portalRoot)
    },
    [portalRoot],
  )

  return createPortal(children, portalRoot as HTMLElement)
}
