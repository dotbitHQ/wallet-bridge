import { t } from '@lingui/macro'
import { Header, Exlaimation, ArrowLeftIcon, SwapChildProps } from '../../components'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { useWalletState } from '../../store'
import { useWebAuthnState } from '../../store/webAuthnState'
import { collapseString } from '../../utils'

export function TransactionFailed({ transitionRef, transitionStyle }: SwapChildProps) {
  const { onClose } = useSimpleRouter()!
  const webAuthnState = useWebAuthnState()
  const { walletSnap } = useWalletState()
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
        <Exlaimation className="size-[80px] text-red-500" />
        <div className="mt-3 text-center text-[16px] font-bold text-red-500">{t`Failed`}</div>
        <div className="mt-3 text-center text-[16px] leading-normal text-neutral-700">
          <div>{t`The contract verification failed.`}</div>
          <div>{t`Please try again.`}</div>
        </div>
        <div className="mb-8 mt-3 text-[12px] font-normal leading-[12px] text-gray-400">
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://${walletSnap.isTestNet ? 'pudge.' : ''}explorer.nervos.org/transaction/${
              webAuthnState.pendingTxHash ?? ''
            }`}
            className="inline-block align-middle"
          >
            {collapseString(webAuthnState.pendingTxHash, 6, 3)}
          </a>
          <ArrowLeftIcon className="h-[12px] rotate-180" />
        </div>
      </div>
    </>
  )
}
