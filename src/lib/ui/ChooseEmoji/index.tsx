import { useState } from 'react'
import { Button, ButtonShape, ButtonSize } from '../../components'
import { useSimpleRouter } from '../../components/SimpleRouter'
import clsx from 'clsx'

export const EmojiList = [
  '📱',
  '🖥️',
  '💻',
  '💾',
  '🌺',
  '🍟',
  '🙂',
  '🌺',
  '🎁',
  '🐭',
  '😍',
  '🌻',
  '🌭',
  '🎂',
  '🐹',
  '😎',
  '🌞',
  '🌮',
  '🍰',
  '🐰',
  '😉',
  '🌕',
  '🍦',
]

export function ChooseEmoji() {
  const goNext = useSimpleRouter()?.goNext
  const [selected, setSelected] = useState<string>()
  return (
    <div className="flex w-full max-w-[400px] flex-col items-center justify-start px-6 py-20">
      <div className="w-full text-center text-[16px] leading-normal text-neutral-700">
        Choose an Emoji for the new device for easy identification.
      </div>
      <div className="mt-6 grid w-full grid-cols-6  rounded-2xl border border-stone-300 border-opacity-20 bg-gray-50 p-2">
        {EmojiList.map((emoji) => (
          <div
            onClick={() => setSelected(emoji)}
            key={emoji}
            className={clsx(
              'h-12 w-12 cursor-pointer select-none rounded-xl bg-white p-2 text-center align-middle text-[32px] leading-8 text-neutral-700 hover:border hover:border-emerald-400',
              selected === emoji && 'border border-emerald-400',
            )}
          >
            {emoji}
          </div>
        ))}
      </div>
      <Button shape={ButtonShape.round} size={ButtonSize.middle} className="mt-7 w-full px-5" onClick={goNext}>
        Next
      </Button>
    </div>
  )
}
