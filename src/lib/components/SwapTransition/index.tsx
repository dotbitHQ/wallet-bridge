import clsx, { ClassValue } from 'clsx'
import React, { CSSProperties, useMemo, useRef, useState } from 'react'
import { Transition, TransitionGroup } from 'react-transition-group'
import { ENTERED, ENTERING, EXITED, EXITING, TransitionStatus, UNMOUNTED } from 'react-transition-group/Transition'

export interface SwapTransitionProps {
  children: React.ReactElement<{
    transitionStyle: CSSProperties
    transitionRef: React.Ref<{ getBoundingClientRect: () => DOMRect }>
  }>
  className?: ClassValue
  duration: number
}

function getTransitionStyle(state: TransitionStatus): CSSProperties {
  switch (state) {
    case ENTERING:
      return { opacity: '100%', position: 'absolute' }
    case ENTERED:
      return { opacity: '100%' }
    case EXITING:
      return { opacity: '0%' }
    case EXITED:
      return { opacity: '0%', position: 'absolute' }
    case UNMOUNTED:
      return { opacity: '0%', position: 'absolute' }
  }
}

export function SwapTransition({ children, className, duration }: SwapTransitionProps) {
  if (children.key === null || children.key === undefined) throw new Error('Child in SwapTransition must have a key')
  const [childRect, setChildRect] = useState<DOMRect>()
  const [animating, setAnimating] = useState(false)
  const transitionRef = useRef<HTMLElement>(null)
  const observer = useMemo(
    () =>
      new ResizeObserver((entries) => {
        setChildRect(entries[0].target.getBoundingClientRect())
      }),
    [setChildRect],
  )
  return (
    <TransitionGroup
      className={clsx(
        className,
        'max-w-full transition-[height,width] ease-in-out',
        animating ? 'overflow-hidden' : 'overflow-scroll',
      )}
      style={{ height: childRect?.height, width: childRect?.width, transitionDuration: `${duration}ms` }}
      component="div"
    >
      <Transition
        key={children.key}
        unmountOnExit
        appear
        nodeRef={transitionRef}
        onEnter={() => {
          setChildRect(transitionRef.current?.getBoundingClientRect())
          observer.disconnect()
          observer.observe(transitionRef.current!)
          setAnimating(true)
        }}
        onEntered={() => {
          setAnimating(false)
        }}
        timeout={duration}
      >
        {(state) => {
          return React.cloneElement(children, {
            transitionStyle: {
              transitionProperty: 'opacity',
              transitionDuration: `${duration}ms`,
              transitionTimingFunction: 'ease-in-out',
              ...getTransitionStyle(state),
            },
            transitionRef,
          })
        }}
      </Transition>
    </TransitionGroup>
  )
}

export interface SwapChildProps {
  transitionRef?: React.Ref<any>
  transitionStyle?: CSSProperties
}
