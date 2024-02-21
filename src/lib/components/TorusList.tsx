import { t } from '@lingui/macro'
import AppleIcon from '../ui/Login/icon/apple-icon.svg'
import GoogleIcon from '../ui/Login/icon/google-icon.svg'
import TwitterIcon from '../ui/Login/icon/twitter-icon.svg'
import { ArrowLeftIcon, LoadingIcon } from './Icons'
import { useState } from 'react'

interface TorusListProps {
  className?: string
  onClick?: () => void
  currentLogin: string
}

export function TorusList({ className, onClick, currentLogin }: TorusListProps) {
  const [name, setName] = useState('')
  const list = [
    {
      logo: <img className="h-5 w-5" src={AppleIcon} alt="Apple ID" />,
      name: 'Apple ID',
    },
    {
      logo: <img className="h-5 w-5" src={GoogleIcon} alt="Google" />,
      name: 'Google',
    },
    {
      logo: <img className="h-5 w-5" src={TwitterIcon} alt="Twitter" />,
      name: 'Twitter',
    },
  ]

  const onSelect = (name: string) => {
    setName(name)
    onClick?.()
  }

  return (
    <div className={className}>
      <div className="mb-2 text-center text-sm font-normal text-neutral-400">{t`or Continue with`}</div>
      <div className="grid gap-y-2">
        {list.map((item, index) => (
          <div
            key={index}
            className="box-border flex h-[52px] cursor-pointer items-center justify-between rounded-2xl border border-gray-100 bg-slate-50 px-4 py-2 hover:bg-secondary active:bg-secondary-active"
            onClick={() => {
              onSelect(item.name)
            }}
          >
            <span className="inline-flex items-center">
              {item.logo}
              <span className="ml-2 text-base text-neutral-700">{item.name}</span>
            </span>
            {item.name === name && currentLogin ? (
              <LoadingIcon className="h-2.5 w-2.5 rotate-180 text-neutral-400"></LoadingIcon>
            ) : (
              <ArrowLeftIcon className="h-2.5 w-2.5 rotate-180 text-neutral-400"></ArrowLeftIcon>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
