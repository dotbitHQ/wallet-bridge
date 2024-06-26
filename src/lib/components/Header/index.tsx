import clsx from 'clsx'
import { ArrowLeftIcon, CloseIcon } from '../Icons'
import { CSSProperties } from 'react'

export interface HeaderProps {
  title?: string
  className?: string
  style?: CSSProperties
  onClose?: () => void
  goBack?: () => void
}

export function Header({ title, className, goBack, onClose, style }: HeaderProps) {
  return (
    <div
      style={style}
      className={clsx(
        'relative flex items-center rounded-t-[32px]',
        goBack != null ? 'justify-around' : 'justify-between',
        className,
      )}
    >
      {goBack != null ? (
        <div
          className={clsx(
            'absolute left-6 inline-flex size-7 cursor-pointer items-center justify-center rounded-lg hover:bg-secondary active:bg-secondary-active',
          )}
          onClick={goBack}
        >
          <ArrowLeftIcon className={'size-3 text-[#D9D9D9]'}></ArrowLeftIcon>
        </div>
      ) : null}
      <div
        className={clsx(
          'w-[84%] truncate text-2xl font-semibold leading-7 text-font-primary',
          goBack != null ? 'text-center' : 'text-left',
          'h-7',
        )}
      >
        {title}
      </div>
      <div
        className={clsx(
          'absolute right-6 inline-flex size-7 cursor-pointer items-center justify-center rounded-lg hover:bg-secondary active:bg-secondary-active',
        )}
        onClick={onClose}
      >
        <CloseIcon className={'size-3 text-[#D9D9D9]'}></CloseIcon>
      </div>
    </div>
  )
}
