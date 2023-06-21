import clsx from 'clsx'

interface MaskProps {
  isOpen: boolean
  zIndex?: string
}

export function Mask({ isOpen, zIndex = 'z-[3]' }: MaskProps) {
  return (
    <div
      className={clsx(
        'fixed left-0 top-0 h-screen w-screen bg-mask-bg',
        isOpen ? 'animation-fade-in' : 'animation-fade-out',
        zIndex,
      )}
    ></div>
  )
}
