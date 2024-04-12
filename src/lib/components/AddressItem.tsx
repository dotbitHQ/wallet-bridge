import { ArrowLeftIcon } from './Icons'
import clsx from 'clsx'
import { Tag } from './Tag'
import { t } from '@lingui/macro'

export function AddressItem(props: { address: string; isCurrent?: boolean; className?: string; onClick?: () => void }) {
  const click = () => {
    props.onClick?.()
  }

  return (
    <li
      className={clsx(
        'box-border flex cursor-pointer items-center justify-between rounded-2xl border border-[#bec0c229] px-4 py-[15px] hover:bg-secondary active:bg-secondary-active',
        props.className,
      )}
      onClick={click}
    >
      <span className="inline-flex flex-col">
        <span className="text-base font-bold leading-5">{props.address}</span>
        <span className="inline-flex">{props.isCurrent ? <Tag className="text-sm">{t`Current`}</Tag> : null}</span>
      </span>
      <ArrowLeftIcon className="size-2.5 rotate-180 text-font-secondary"></ArrowLeftIcon>
    </li>
  )
}
