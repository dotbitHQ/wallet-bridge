import { ReactNode } from 'react'
import clsx from 'clsx'

export enum TagVariant {
  default = 'default',
  primary = 'primary',
}

const variantClasses: Record<TagVariant, string> = {
  // eslint-disable-next-line lingui/no-unlocalized-strings
  [TagVariant.default]: 'text-font-tips bg-secondary',
  // eslint-disable-next-line lingui/no-unlocalized-strings
  [TagVariant.primary]: 'text-[#00A270] bg-[#E3F6ED]',
}

export interface TagProps {
  variant?: TagVariant
  className?: string
  children: ReactNode
}

export function Tag({ variant = TagVariant.default, children, className }: TagProps) {
  return (
    <span
      className={clsx(
        'box-border inline-block rounded px-1 py-0.5 text-sm font-medium leading-none',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
