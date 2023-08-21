import clsx from 'clsx'
import { Portal } from '../Portal'
import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { getShadowDomRoot } from '../../utils'

export interface ToastProps {
  visible: boolean
  message: string
  duration?: number
  customRootId?: string
  zIndex?: string
}

export function Toast({ visible, message, duration = 1000, customRootId, zIndex = 'z-[4]' }: ToastProps) {
  const [removeDOM, setRemoveDOM] = useState(!visible)

  useEffect(() => {
    if (visible) {
      setRemoveDOM(false)
    }
  }, [visible])

  useEffect(() => {
    window.setTimeout(() => {
      setRemoveDOM(true)
    }, duration)
  }, [duration])

  return removeDOM ? null : (
    <Portal customRootId={customRootId ?? 'toast-root'}>
      <span
        className={clsx(
          'fixed inset-0 m-auto h-max w-max min-w-[120px] rounded-lg bg-[#11142D] p-4 text-center text-base font-semibold leading-[22px] text-white shadow-toast',
          zIndex,
        )}
      >
        {message}
      </span>
    </Portal>
  )
}

export const createToast = (props: Omit<ToastProps, 'visible'>) => {
  const toastProps = {
    ...props,
    visible: true,
  }

  const shadowDomRoot = getShadowDomRoot()
  const instance = React.createElement(Toast, toastProps)
  createRoot(shadowDomRoot).render(instance)
}
