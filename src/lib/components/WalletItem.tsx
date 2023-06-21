import { ReactNode } from 'react'
import { ArrowLeftIcon, LoadingIcon } from './Icons'
import clsx from 'clsx'

export function WalletItem(props: {
  name: string
  icon: ReactNode
  currentLogin?: string
  className?: string
  onClick?: () => void
}) {
  const click = () => {
    props.onClick?.()
  }

  return (
    <li
      className={clsx(
        'box-border flex cursor-pointer items-center justify-between rounded-2xl py-2 pl-2 pr-4 hover:bg-secondary active:bg-secondary-active',
        props.className,
      )}
      onClick={click}
    >
      <span className="inline-flex items-center">
        {props.icon}
        <span className="ml-4 text-base leading-5">{props.name}</span>
      </span>
      {props.name === props.currentLogin ? (
        <LoadingIcon className="h-2.5 w-2.5 text-font-secondary"></LoadingIcon>
      ) : (
        <ArrowLeftIcon className="h-2.5 w-2.5 rotate-180 text-font-secondary"></ArrowLeftIcon>
      )}
    </li>
  )
}
