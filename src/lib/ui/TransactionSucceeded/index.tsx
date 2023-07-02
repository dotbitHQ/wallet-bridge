import { Button, ButtonShape, ButtonSize, SafeIcon } from '../../components'
import { useSimpleRouter } from '../../components/SimpleRouter'

export function TransactionSucceeded() {
  const goNext = useSimpleRouter()?.goNext
  return (
    <div className="relative flex w-full max-w-[400px] flex-col items-center justify-start px-6 pb-6">
      <SafeIcon className="h-[80px] w-[80px] text-green-500" />
      <div className="mt-3 text-center text-[16px] font-bold text-neutral-700">Successfully Associated</div>
      <div className="mt-3 text-center text-[16px] leading-normal text-neutral-700">
        The new device has full control over this address.
      </div>
      <Button className="m-6 min-w-[130px] px-5" size={ButtonSize.middle} shape={ButtonShape.round} onClick={goNext}>
        Done
      </Button>
    </div>
  )
}
