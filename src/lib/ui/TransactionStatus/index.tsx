import { useQuery } from '@tanstack/react-query'
import { ArrowLeftIcon, Header, LoadingIconGradient, SwapChildProps } from '../../components'
import { useWebAuthnState } from '../../store/webAuthnState'
import { collapseString } from '../../utils'
import { setWalletState, useWalletState } from '../../store'
import { useEffect } from 'react'
import { useSimpleRouter } from '../../components/SimpleRouter'

export function TransactionStatus({ transitionRef, transitionStyle }: SwapChildProps) {
  const { walletSnap } = useWalletState()
  const webAuthnState = useWebAuthnState()
  const { goTo, goNext, onClose } = useSimpleRouter()!
  const query = useQuery({
    networkMode: 'always',
    queryKey: ['TransactionStatus', webAuthnState.pendingTxHash],
    cacheTime: 0,
    refetchInterval: 10000,
    queryFn: async () => {
      const res = await fetch(`https://test-webauthn-api.did.id/v1/transaction/status`, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify({
          tx_hash: webAuthnState.pendingTxHash,
        }),
      }).then(async (res) => await res.json())
      if (res.err_no !== 0) throw new Error(res.err_msg)
      return res.data
    },
  })

  useEffect(() => {
    if (query.isLoading) return
    if (query.data?.hash === webAuthnState.pendingTxHash) {
      if (query.data?.status === 1) {
        setWalletState({
          ckbAddresses: walletSnap.ckbAddresses!.concat([webAuthnState.backupDeviceData!.ckbAddr]),
        })
        goNext?.()
      } else if (query.data?.status === -1) {
        goTo('TransactionFailed')
      }
    } else {
      goTo('TransactionFailed')
    }
    // eslint-disable-next-line
  }, [query.data, query.isLoading, webAuthnState.pendingTxHash])

  return (
    <>
      <Header
        onClose={onClose}
        className="z-10 w-full bg-white p-6"
        style={{ ...transitionStyle, position: 'fixed', top: 0 }}
      />
      <div
        className="relative flex w-full max-w-[400px] flex-col items-center justify-start px-6 pb-6 pt-[76px]"
        ref={transitionRef}
        style={transitionStyle}
      >
        <LoadingIconGradient className="animation-rotate-360-deg h-[64px] w-[64px] text-emerald-500" />
        <div className="mt-4 text-center text-[16px] font-bold text-neutral-700">Device Adding</div>
        <div className="mt-3 text-center text-[16px] leading-normal text-neutral-700">Approximately 3 minutes.</div>
        <div className="mb-8 mt-3 text-[12px] font-normal leading-[12px] text-gray-400">
          <span className="inline-block align-middle">{collapseString(webAuthnState.pendingTxHash, 6, 3)}</span>
          <ArrowLeftIcon className="h-[12px] rotate-180" />
        </div>
      </div>
    </>
  )
}
