import { Header, Exlaimation, ArrowLeftIcon } from '../../components'
import { useSimpleRouter } from '../../components/SimpleRouter'
import { useWebAuthnState } from '../../store/webAuthnState'
import { collapseString } from '../../utils'

export function TransactionFailed() {
  const { onClose } = useSimpleRouter()!
  const webAuthnState = useWebAuthnState()
  return (
    <>
      <Header onClose={onClose} className="p-6" />
      <div className="relative flex w-full max-w-[400px] flex-col items-center justify-start px-6 pb-6">
        <Exlaimation className="h-[80px] w-[80px] text-red-500" />
        <div className="mt-3 text-center text-[16px] font-bold text-red-500">Failed</div>
        <div className="mt-3 text-center text-[16px] leading-normal text-neutral-700">
          <div>The contract verification failed.</div>
          <div>Please try again.</div>
        </div>
        <div className="mb-8 mt-3 text-[12px] font-normal leading-[12px] text-gray-400">
          <span className="inline-block align-middle">{collapseString(webAuthnState.pendingTxHash, 6, 3)}</span>
          <ArrowLeftIcon className="h-[12px] rotate-180" />
        </div>
      </div>
    </>
  )
}
