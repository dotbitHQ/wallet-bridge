import { ReactNode } from 'react'
import clsx from 'clsx'

export enum AlertType {
  warning = 'warning',
}

const typeClasses: Record<AlertType, string> = {
  // eslint-disable-next-line lingui/no-unlocalized-strings
  [AlertType.warning]: 'text-[#AC6E15] bg-[#F9CD4E28] border-[#F9CD4E5B]',
}

export interface AlertProps {
  type?: AlertType
  className?: string
  icon?: ReactNode
  children: ReactNode
}

export function Alert({ type = AlertType.warning, children, className, icon }: AlertProps) {
  return (
    <div
      className={clsx('box-border flex items-center rounded-xl border p-3 leading-none', typeClasses[type], className)}
    >
      {icon ? (
        <span className="flex">
          {icon}
          <span className="mx-3 w-px bg-[#FDEDBF]"></span>
        </span>
      ) : null}
      {children}
    </div>
  )
}
