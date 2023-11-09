/* eslint-disable lingui/no-unlocalized-strings */
import Color from 'color'
import clsx, { ClassValue } from 'clsx'
import { Keccak } from 'sha3'

interface LetterAvatarProps {
  data: string
  className?: ClassValue
  bgFn?: (data: string) => string
  colorFn?: (data: string) => string
  letterFn?: (data: string) => string
}

function defaultLetterFn(data: string) {
  return data[0].toUpperCase() || ''
}

const pallete = [
  'rgb(226, 95, 81)',
  'rgb(242, 96, 145)',
  'rgb(187, 101, 202)',
  'rgb(149, 114, 207)',
  'rgb(120, 132, 205)',
  'rgb(91, 149, 249)',
  'rgb(72, 194, 249)',
  'rgb(69, 208, 226)',
  'rgb(72, 182, 172)',
  'rgb(82, 188, 137)',
  'rgb(155, 206, 95)',
  'rgb(212, 227, 74)',
  'rgb(254, 218, 16)',
  'rgb(247, 192, 0)',
  'rgb(255, 168, 0)',
  'rgb(255, 138, 96)',
  'rgb(194, 194, 194)',
  'rgb(143, 164, 175)',
  'rgb(162, 136, 126)',
  'rgb(163, 163, 163)',
  'rgb(175, 181, 226)',
  'rgb(179, 155, 221)',
  'rgb(194, 194, 194)',
  'rgb(124, 222, 235)',
  'rgb(188, 170, 164)',
  'rgb(173, 214, 125)',
]

const hasher = new Keccak()

function getDeterminedRandom(s: string, length: number) {
  hasher.reset()
  hasher.update(s)
  const hash = hasher.digest('hex')
  const digits = Math.max(hash.length, Math.ceil(Math.log2(length * 16) / 4))
  return parseInt(hash.slice(-digits), 16) % length
}

function defaultColorFn(data: string) {
  const base = pallete[getDeterminedRandom(data, pallete.length)]
  const color = Color(base)
  return color.rgb().toString()
}

function defaultBgFn(data: string) {
  const base = pallete[getDeterminedRandom(data, pallete.length)]!
  const color = Color(base)
  return color.fade(0.8).rgb().toString()
}

export function LetterAvatar({
  data,
  className = 'w-7 h-7 text-[12px]',
  bgFn = defaultBgFn,
  colorFn = defaultColorFn,
  letterFn = defaultLetterFn,
}: LetterAvatarProps) {
  return (
    <div
      className={clsx('inline-flex items-center justify-center rounded-full', className)}
      style={{ backgroundColor: bgFn(data), color: colorFn(data) }}
    >
      {letterFn(data)}
    </div>
  )
}
