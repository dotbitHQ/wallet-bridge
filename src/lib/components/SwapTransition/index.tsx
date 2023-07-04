import clsx, { ClassValue } from 'clsx'
import React, { useMemo, useRef, useState } from 'react'
import { Transition, TransitionGroup } from 'react-transition-group'
import { ENTERED, ENTERING, EXITED, EXITING, TransitionStatus, UNMOUNTED } from 'react-transition-group/Transition'

export interface SwapTransitionProps {
  children: React.ReactElement<any & { className: string }>
  className?: ClassValue
  duration?: ClassValue
}

function getTransitionClassName(state: TransitionStatus): string {
  switch (state) {
    case ENTERING:
      return 'opacity-100'
    case ENTERED:
      return 'opacity-100'
    case EXITING:
      return 'opacity-0'
    case EXITED:
      return 'opacity-0'
    case UNMOUNTED:
      return 'opacity-0'
  }
}

export function SwapTransition({ children, className, duration }: SwapTransitionProps) {
  const [childRect, setChildRect] = useState<DOMRect>()
  const observer = useMemo(
    () =>
      new ResizeObserver((entries) => {
        setChildRect(entries[0].target.getBoundingClientRect())
      }),
    [setChildRect],
  )
  if (children.key === null || children.key === undefined) throw new Error('Child in SwapTransition must have a key')
  return (
    <TransitionGroup
      className={clsx(
        className,
        'relative max-w-full transform-gpu overflow-hidden transition-[height,width] ease-in-out ',
        duration,
      )}
      style={{ height: childRect?.height, width: childRect?.width }}
    >
      <Transition
        key={children.key}
        addEndListener={(node, done) => {
          node.addEventListener('transitionend', done, false)
        }}
        unmountOnExit
        appear
        onEnter={(node, _) => {
          setChildRect(node.getBoundingClientRect())
          observer.disconnect()
          observer.observe(node)
        }}
      >
        {(state) => {
          return React.cloneElement(children, {
            className: clsx(
              children.props.className,
              'absolute transform-gpu transition-[opacity] ease-in-out',
              duration,
              getTransitionClassName(state),
            ),
          })
        }}
      </Transition>
    </TransitionGroup>
  )
}
