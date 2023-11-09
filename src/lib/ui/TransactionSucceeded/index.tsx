import { t } from '@lingui/macro'
import { Button, ButtonShape, ButtonSize, Header, SafeIcon, SwapChildProps } from '../../components'
import { useSimpleRouter } from '../../components/SimpleRouter'

export function TransactionSucceeded({ transitionRef, transitionStyle }: SwapChildProps) {
  const { goNext, onClose } = useSimpleRouter()!
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
        <SafeIcon className="h-[80px] w-[80px] text-green-500" />
        <div className="mt-3 text-center text-[16px] font-bold text-neutral-700">{t`New Trusted Device Added`}</div>
        <div className="mt-3 text-center text-[16px] leading-normal text-neutral-700">
          {t`The new trusted device has full control over this address.`}
        </div>
        <Button
          className="mb-8 mt-4 min-w-[130px] px-5"
          size={ButtonSize.middle}
          shape={ButtonShape.round}
          onClick={goNext}
        >
          {t`Done`}
        </Button>
      </div>
    </>
  )
}
