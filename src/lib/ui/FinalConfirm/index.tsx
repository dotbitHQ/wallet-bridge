import { useState } from 'react'
import { Button, ButtonShape, ButtonSize } from '../../components'
import { useSimpleRouter } from '../../components/SimpleRouter'

export function FinalConfirm() {
  const goNext = useSimpleRouter()?.goNext
  const [checked, setChecked] = useState(false)
  return (
    <div className="relative flex w-full max-w-[400px] flex-col items-center justify-start p-6">
      <div className="w-full text-center text-[16px] leading-normal text-neutral-700">
        You are associating the following devices with CKB000...000
      </div>
      <div className="mt-6 flex w-full items-stretch justify-between gap-4 rounded-2xl border border-slate-300 border-opacity-40 bg-gray-50 p-6">
        <div className="h-[44px] flex-none text-center text-[44px] leading-[44px] text-neutral-700">🐹</div>
        <div className="flex flex-auto flex-col items-start justify-between gap-2">
          <div className="h-[19px] text-[16px] font-semibold leading-[19px] text-neutral-700">Chrome-dotbit-1217</div>
          <div className="h-[18px] rounded-md bg-amber-500 bg-opacity-10 px-1 py-0.5 text-[12px] leading-[18px] text-yellow-600">
            New device
          </div>
        </div>
      </div>
      <div className="mt-16 inline-flex w-full items-center justify-center gap-3">
        <input
          type="checkbox"
          className="h-5 w-5 rounded-md border-2 border-slate-300 border-opacity-40 accent-emerald-400"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <div className="text-[14px] text-neutral-700">I Trust This Device.</div>
      </div>
      <Button
        disabled={!checked}
        className="m-6 w-full px-5"
        size={ButtonSize.middle}
        shape={ButtonShape.round}
        onClick={goNext}
      >
        Next
      </Button>
    </div>
  )
}
