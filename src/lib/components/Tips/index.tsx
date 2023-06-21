import { Dialog } from '../Dialog'
import React, { ReactNode, useState } from 'react'
import { Button, ButtonShape } from '../Button'
import { createRoot } from 'react-dom/client'

interface TipsProps {
  visible: boolean
  title: string
  content: ReactNode
  confirmBtnText?: string
  onClose?: () => void
  onConfirm?: () => void
}

let tipsCustomRootId = 0

export function Tips({ visible, title, content, confirmBtnText, onClose, onConfirm }: TipsProps) {
  const [isOpen, setIsOpen] = useState(visible)
  tipsCustomRootId = tipsCustomRootId + 1

  const close = () => {
    onClose?.()
    setIsOpen(false)
  }

  const confirm = () => {
    onConfirm?.()
    setIsOpen(false)
  }

  return (
    <Dialog customRootId={`tips-${tipsCustomRootId}`} isOpen={isOpen} title={title} onClose={close} zIndex="z-[4]">
      <div className="mb-8 mt-2">{content}</div>
      <Button className="mb-6 w-full" shape={ButtonShape.round} onClick={confirm}>
        {confirmBtnText ?? 'OK'}
      </Button>
    </Dialog>
  )
}

export const createTips = (props: Omit<TipsProps, 'visible'>) => {
  const tipsProps = {
    ...props,
    visible: true,
  }

  const container = document.createElement('div')
  document.body.appendChild(container)
  const instance = React.createElement(Tips, tipsProps)
  createRoot(container).render(instance)
}
