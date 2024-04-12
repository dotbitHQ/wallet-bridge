import { ReactNode, useEffect, useState } from 'react'
import { Mask } from './Mask'
import { Portal } from './Portal'
import clsx from 'clsx'

interface SheetProps {
  isOpen: boolean
  children?: ReactNode
  className?: string
  customRootId?: string
  zIndex?: string
}

export function Sheet({ isOpen, children, customRootId, zIndex = 'z-[10]', className }: SheetProps) {
  const [removeDOM, setRemoveDOM] = useState(!isOpen)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setRemoveDOM(false)
    } else {
      globalThis.setTimeout(() => {
        setRemoveDOM(true)
        document.body.style.overflow = 'auto'
      }, 150)
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return removeDOM ? null : (
    <Portal customRootId={customRootId} className={className}>
      <Mask zIndex={zIndex} isOpen={isOpen} />
      <div className={clsx('fixed left-0 top-0 flex size-full items-end justify-center', zIndex)}>{children}</div>
    </Portal>
  )
}
