import { useEffect, ReactNode } from 'react'
import { I18nProvider } from '@lingui/react'
import { i18n, Messages } from '@lingui/core'
import { useWalletState } from '../store'
import { messages as en } from '../../locales/en'
import { messages as zhCN } from '../../locales/zh-CN'
import { messages as zhHK } from '../../locales/zh-HK'

const messages: Record<string, Messages> = {
  en,
  'zh-CN': zhCN,
  'zh-HK': zhHK,
}

export const I18n = ({ children }: { children?: ReactNode }) => {
  const {
    walletSnap: { locale },
  } = useWalletState()

  useEffect(() => {
    if (locale === undefined) return
    i18n.loadAndActivate({ locale, messages: messages[locale] || messages.en })
  }, [locale])

  return <I18nProvider i18n={i18n}>{children}</I18nProvider>
}
