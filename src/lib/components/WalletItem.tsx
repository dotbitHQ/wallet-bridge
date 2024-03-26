import { ReactNode } from 'react'
import { LoadingIcon } from './Icons'
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
        <span className="ml-4 text-base font-semibold leading-5">{props.name}</span>
      </span>
      {props.name === props.currentLogin ? <LoadingIcon className="size-2.5 text-font-secondary"></LoadingIcon> : null}
    </li>
  )
}
