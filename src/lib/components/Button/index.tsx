import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'
import { ArrowRightUpIcon, LoadingIcon } from '../Icons'

export enum ButtonVariant {
  primary = 'primary',
  secondary = 'secondary',
  danger = 'danger',
}

export const variantClasses: Record<ButtonVariant, string> = {
  [ButtonVariant.primary]:
    'text-white bg-success hover:bg-success-hover disabled:cursor-no-drop disabled:opacity-60 disabled:bg-success',
  [ButtonVariant.secondary]:
    'text-font-primary bg-secondary hover:secondary-hover active:bg-secondary-active disabled:cursor-no-drop disabled:bg-secondary-disabled',
  [ButtonVariant.danger]:
    'text-white bg-danger hover:bg-danger-hover disabled:cursor-no-drop disabled:bg-danger-disabled',
}

export enum ButtonSize {
  small = 'small',
  middle = 'middle',
  large = 'large',
}

export const sizeClasses: Record<ButtonSize, string> = {
  [ButtonSize.small]: 'h-[38px] px-3 text-sm font-medium',
  [ButtonSize.middle]: 'h-[42px] px-4 text-base font-medium',
  [ButtonSize.large]: 'h-[52px] px-4 text-base font-medium',
}

export enum ButtonShape {
  default = 'default',
  round = 'round',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize
  variant?: ButtonVariant
  shape?: ButtonShape
  loading?: boolean
  outlink?: boolean
}

export const Button = ({
  size = ButtonSize.middle,
  variant = ButtonVariant.primary,
  loading = false,
  outlink = false,
  shape = ButtonShape.default,
  ...props
}: ButtonProps) => {
  const getRadius = (newShape: ButtonShape, newSize: ButtonSize): string => {
    let newRadius = ''
    if (newShape === ButtonShape.default) {
      switch (newSize) {
        case ButtonSize.small:
          newRadius = 'rounded-lg'
          break
        case ButtonSize.middle:
          newRadius = 'rounded-xl'
          break
        case ButtonSize.large:
          newRadius = 'rounded-[14px]'
          break
      }
    } else if (newShape === ButtonShape.round) {
      switch (newSize) {
        case ButtonSize.small:
          newRadius = 'rounded-[19px]'
          break
        case ButtonSize.middle:
          newRadius = 'rounded-[21px]'
          break
        case ButtonSize.large:
          newRadius = 'rounded-[26px]'
          break
      }
    }
    return newRadius
  }

  return (
    <button
      className={clsx(
        'flex cursor-pointer items-center justify-center outline-0',
        variantClasses[variant],
        sizeClasses[size],
        getRadius(shape, size),
      )}
      {...props}
      disabled={props.disabled === true || loading}
    >
      {loading ? (
        <span className="mr-1 inline-flex">
          <LoadingIcon className="animation-rotate-360-deg h-5 w-5" />
        </span>
      ) : null}
      {props.children}
      {outlink ? <ArrowRightUpIcon className="ml-3 h-2.5 w-2.5"></ArrowRightUpIcon> : null}
    </button>
  )
}
