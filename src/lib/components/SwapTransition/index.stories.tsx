import { ComponentMeta, ComponentStory, Meta, Story, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Button } from '../Button'
import { SwapTransition } from '.'

export default {
  title: 'Components/SwapTransition',
  component: SwapTransition,
  argTypes: {
    duration: { type: 'number' },
    className: { type: 'string' },
  },
  args: {
    className: 'border border-solid',
    duration: 300,
  },
} as ComponentMeta<typeof SwapTransition>

const Template: ComponentStory<typeof SwapTransition> = function (args) {
  const [toggle, setToggle] = useState(false)

  return (
    <>
      <Button
        onClick={() => {
          setToggle(!toggle)
        }}
      >
        toggle
      </Button>
      <SwapTransition {...args}>
        {toggle ? (
          <div key={1} className="inline-block whitespace-nowrap">
            <div>Some contents...</div>
            <div>Some contents...</div>
            <div>Some contents...</div>
            <div>Some contents...</div>
            <div>Some contents...</div>
            <div>Some contents...</div>
          </div>
        ) : (
          <div key={2} className="inline-block whitespace-nowrap">
            <div>asdlkfjalskdjf</div>
          </div>
        )}
      </SwapTransition>
    </>
  )
}

export const DefaultTransition = Template.bind({})
