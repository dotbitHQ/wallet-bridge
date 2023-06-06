import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

export const BUTTON_VARIANT = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
} as const
export type ButtonVariant = keyof typeof BUTTON_VARIANT

export const variantClasses: Record<ButtonVariant, string> = {
  PRIMARY: 'bg-green-200 hover:bg-green-400 active:bg-green-500',
  SECONDARY: 'bg-blue-200 hover:bg-blue-400 active:bg-blue-500',
  TERTIARY: 'bg-red-200 hover:bg-red-400 active:bg-red-500',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  variant?: ButtonVariant
  isDisabled?: boolean
}

export const Button = ({ label, variant = 'PRIMARY', isDisabled = false, onClick }: ButtonProps) => {
  return (
    <button
      className={clsx('transition-colors px-6 py-2 rounded-md', variantClasses[variant], {
        'bg-gray-300 text-slate-600 cursor-not-allowed pointer-events-none': isDisabled,
      })}
      onClick={isDisabled ? onClick : undefined}
    >
      {label}
    </button>
  )
}
