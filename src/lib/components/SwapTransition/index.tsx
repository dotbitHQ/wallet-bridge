import clsx, { ClassValue } from 'clsx'
import React, { useRef, useState } from 'react'
import { Transition, TransitionGroup } from 'react-transition-group'
import { ENTERED, ENTERING, EXITED, EXITING, TransitionStatus, UNMOUNTED } from 'react-transition-group/Transition'

export interface SwapTransitionProps {
  children: React.ReactElement
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
  const nodeRef = useRef<HTMLElement>(null)
  const [childRect, setChildRect] = useState<DOMRect>()
  return (
    <TransitionGroup
      className={clsx(className, 'relative overflow-y-hidden transition-all ease-in-out', duration)}
      style={{ height: childRect?.height }}
    >
      <Transition
        key={children.key}
        nodeRef={nodeRef}
        addEndListener={(done) => nodeRef.current?.addEventListener('transitionend', done, false)}
        unmountOnExit
        appear
        onEntering={() => {
          nodeRef.current && setChildRect(nodeRef.current.getBoundingClientRect())
        }}
      >
        {(state) => {
          return React.cloneElement(children, {
            className: clsx(
              children.props.className,
              'transition-all ease-in-out absolute',
              duration,
              getTransitionClassName(state),
            ),
            ref: nodeRef,
          })
        }}
      </Transition>
    </TransitionGroup>
  )
}
