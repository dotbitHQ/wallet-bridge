import { useCallback, useState } from 'react'
import { Button, ButtonShape, ButtonSize } from '../../components'
import { useSimpleRouter } from '../../components/SimpleRouter'
import clsx from 'clsx'
import { emojis } from './png'

export function ChooseEmoji() {
  const goNext = useSimpleRouter()?.goNext
  const [selected, setSelected] = useState<string>()
  const onClick = useCallback((k: string) => () => setSelected(k), [setSelected])
  return (
    <div className="flex w-full max-w-[400px] flex-col items-center justify-start px-6 py-20">
      <div className="w-full text-center text-[16px] leading-normal text-neutral-700">
        Choose an Emoji for the new device for easy identification.
      </div>
      <div className="mt-6 grid w-full grid-cols-6 rounded-2xl border border-stone-300 border-opacity-20 bg-gray-50 p-2">
        {Object.entries(emojis).map(([k, v]) => (
          <div
            onClick={onClick(k)}
            key={k}
            className={clsx(
              'relative box-border h-12 w-12 cursor-pointer select-none rounded-xl transition-none active:bg-slate-600/20',
              selected === k ? 'border-2 border-emerald-400 bg-white' : 'hover:bg-slate-600/10',
            )}
          >
            <img className="absolute left-1/2 top-1/2 w-8 max-w-none -translate-x-1/2 -translate-y-1/2" src={v} />
          </div>
        ))}
      </div>
      <Button
        disabled={selected === undefined}
        shape={ButtonShape.round}
        size={ButtonSize.middle}
        className="mt-7 w-full px-5"
        onClick={goNext}
      >
        Next
      </Button>
    </div>
  )
}
