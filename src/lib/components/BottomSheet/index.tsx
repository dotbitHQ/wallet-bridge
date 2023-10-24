import { ReactNode } from 'react'
import { Header } from '../Header'
import clsx from 'clsx'
import { Sheet } from '../Sheet'

export interface BottomSheetProps {
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

export function BottomSheet({
  isOpen,
  title,
  children,
  customRootId,
  containerXMargin = 'mx-6',
  containerYMargin = 'my-0',
  zIndex = 'z-[10]',
  onClose,
  goBack,
}: BottomSheetProps) {
  return (
    <Sheet customRootId={customRootId ?? 'dialog-root'} isOpen={isOpen} zIndex={zIndex}>
      <div
        className={clsx(
          'box-border w-full overflow-hidden rounded-t-[32px] border-2 border-solid border-[#5262791A] bg-white',
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
    </Sheet>
  )
}
