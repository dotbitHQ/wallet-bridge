import { useQuery } from '@tanstack/react-query'
import { ArrowLeftIcon, Header, LoadingIconGradient, SwapChildProps } from '../../components'
import { useWebAuthnState } from '../../store/webAuthnState'
import { collapseString } from '../../utils'
import { setWalletState, useWalletState } from '../../store'
import { useEffect } from 'react'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { useWebAuthnService } from '../../services'
import { t } from '@lingui/macro'

export function TransactionStatus({ transitionRef, transitionStyle }: SwapChildProps) {
  const { walletSnap } = useWalletState()
  const webAuthnState = useWebAuthnState()
  const { goTo, goNext, onClose } = useSimpleRouter()!
  const webAuthnService = useWebAuthnService(walletSnap.isTestNet)
  const query = useQuery({
    networkMode: 'always',
    // eslint-disable-next-line lingui/no-unlocalized-strings
    queryKey: ['TransactionStatus', webAuthnState.pendingTxHash],
    cacheTime: 0,
    refetchInterval: 10000,
    queryFn: async () => {
      const res = await webAuthnService.getTransactionStatus(webAuthnState.pendingTxHash!)
      if (res.err_no !== 0) throw new Error(res.err_msg)
      return res.data
    },
  })

  useEffect(() => {
    if (query.isLoading) return
    if (query.data?.hash === webAuthnState.pendingTxHash) {
      if (query.data?.status === 1) {
        setWalletState({
          deviceList: walletSnap.deviceList!.concat([
            {
              address: webAuthnState.backupDeviceData!.ckbAddr,
              notes: webAuthnState.backupDeviceData!.name,
            },
          ]),
        })
        goNext?.()
      } else if (query.data?.status === -1) {
        // eslint-disable-next-line lingui/no-unlocalized-strings
        goTo('TransactionFailed')
      }
    } else {
      // eslint-disable-next-line lingui/no-unlocalized-strings
      goTo('TransactionFailed')
    }
    // eslint-disable-next-line
  }, [query.data, query.isLoading, webAuthnState.pendingTxHash])

  return (
    <>
      <Header
        onClose={onClose}
        className="z-10 mt-0.5 w-full-4px bg-white p-6"
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div
        className="relative flex w-full flex-col items-center justify-start px-6 pb-6 pt-[76px]"
        ref={transitionRef}
        style={transitionStyle}
      >
        <LoadingIconGradient className="animation-rotate-360-deg size-[64px] text-emerald-500" />
        <div className="mt-4 text-center text-[16px] font-bold text-neutral-700">{t`Adding Trusted Device`}</div>
        <div className="mt-3 text-center text-[16px] leading-normal text-neutral-700">{t`Approximately 3 minutes.`}</div>
        <div className="mb-8 mt-3 text-[12px] font-normal leading-[12px]">
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://${walletSnap.isTestNet ? 'pudge.' : ''}explorer.nervos.org/transaction/${
              webAuthnState.pendingTxHash ?? ''
            }`}
            className="inline-block align-middle text-font-secondary"
          >
            {collapseString(webAuthnState.pendingTxHash, 6, 3)}
          </a>
          <ArrowLeftIcon className="h-[12px] rotate-180 text-font-secondary" />
        </div>
      </div>
    </>
  )
}
