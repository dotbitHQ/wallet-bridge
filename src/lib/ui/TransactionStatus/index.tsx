import { ArrowLeftIcon, LoadingIconGradient } from '../../components'

export function TransactionStatus() {
  return (
    <div className="relative flex w-full max-w-[400px] flex-col items-center justify-start px-6 pb-6">
      <LoadingIconGradient className="animation-rotate-360-deg h-[64px] w-[64px] text-emerald-500" />
      <div className="mt-4 text-center text-[16px] font-bold text-neutral-700">Device Adding</div>
      <div className="mt-3 text-center text-[16px] leading-normal text-neutral-700">Approximately 3 minutes.</div>
      <div className="mt-3 text-[12px] font-normal leading-[12px] text-gray-400">
        <span className="inline-block align-middle">0xdda…e67d3</span>
        <ArrowLeftIcon className="h-[12px] rotate-180" />
      </div>
    </div>
  )
}
