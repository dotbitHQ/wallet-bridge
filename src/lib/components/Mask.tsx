import clsx from 'clsx'

interface MaskProps {
  isOpen: boolean
}

export function Mask({ isOpen }: MaskProps) {
  return (
    <div
      className={clsx(
        'fixed left-0 top-0 z-[2] h-screen w-screen bg-mask-bg',
        isOpen ? 'animation-fade-in' : 'animation-fade-out',
      )}
    ></div>
  )
}
