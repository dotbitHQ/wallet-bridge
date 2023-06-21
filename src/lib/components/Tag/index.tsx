import { ReactNode } from 'react'
import { ButtonVariant } from '../Button'
import clsx from 'clsx'

export enum TagVariant {
  primary = 'primary',
}

export const variantClasses: Record<TagVariant, string> = {
  [ButtonVariant.primary]: 'text-[#00A270] bg-[#E3F6ED]',
}

export interface TagProps {
  variant?: TagVariant
  className?: string
  children: ReactNode
}

export function Tag({ variant = TagVariant.primary, children, className }: TagProps) {
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
