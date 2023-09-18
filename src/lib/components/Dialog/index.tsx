import { ReactNode } from 'react'
import { Modal } from '../Modal'
import { Header } from '../Header'
import clsx from 'clsx'

export interface DialogProps {
  isOpen: boolean
  title?: string
  children?: ReactNode
  customRootId?: string
  containerXMargin?: string
  containerYMargin?: string
  zIndex?: string
  onClose?: () => void
  goBack?: () => void
}

export function Dialog({
  isOpen,
  title,
  children,
  customRootId,
  containerXMargin = 'mx-6',
  containerYMargin = 'my-0',
  zIndex = 'z-[1000]',
  onClose,
  goBack,
}: DialogProps) {
  return (
    <Modal customRootId={customRootId ?? 'dialog-root'} isOpen={isOpen} zIndex={zIndex}>
      <div
        className={clsx(
          'box-border w-[92%] max-w-[400px] overflow-hidden rounded-[32px] border-2 border-solid border-[#5262791A] bg-white',
          isOpen ? 'animation-fade-in-up' : 'animation-fade-out-down',
        )}
      >
        <Header className="p-6" title={title} goBack={goBack} onClose={onClose} />
        <div
          className={clsx(
            'scrollbar-hide dialog-children-container overflow-y-auto',
            containerXMargin,
            containerYMargin,
          )}
        >
          {children}
        </div>
      </div>
    </Modal>
  )
}
