import { Button, ButtonShape, ButtonSize } from '../../components'
import { useSimpleRouter } from '../../components/SimpleRouter'
import AlertBanner from './alert-banner.svg'

export function EnhanceSecurity() {
  const goNext = useSimpleRouter()?.goNext
  return (
    <div className="flex w-full max-w-[400px] flex-col items-center justify-start px-6 py-20">
      <img className="w-[136px]" src={AlertBanner} />
      <div className="my-5 w-full text-center text-[20px] font-bold text-neutral-700">
        Losing the current device will result in the loss of your assets.
      </div>
      <div className="w-full text-center text-[14px] font-normal leading-normal text-zinc-500">
        The current CKB address can only be accessed by this device. Take one minute to associate it with other devices
        or addresses to ensure that you can still access your assets even if this device is lost.
      </div>
      <Button shape={ButtonShape.round} size={ButtonSize.middle} className="mt-6 px-5" onClick={goNext}>
        立即增强安全性
      </Button>
    </div>
  )
}
