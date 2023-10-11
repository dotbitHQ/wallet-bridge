import { ButtonHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'
import { LoadingIcon } from '../Icons'

export interface LoggedInButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  icon?: ReactNode
}

export const LoggedInButton = ({ loading = false, className, icon, ...props }: LoggedInButtonProps) => {
  return (
    <button
      {...props}
      className={clsx(
        'box-border flex w-full cursor-pointer flex-col items-center rounded-2xl border border-[#B6C4D966] px-2 py-3 text-sm font-medium leading-[normal] text-font-tips shadow-loggedin-button outline-0 hover:shadow-none active:bg-secondary active:shadow-none',
        className,
      )}
      disabled={props.disabled === true || loading}
    >
      {loading ? (
        <span className="mr-1.5 inline-flex">
          <LoadingIcon className="h-5 w-5 text-[#5F6570]" />
        </span>
      ) : (
        icon
      )}
      <div className="mt-1">{props.children}</div>
    </button>
  )
}
