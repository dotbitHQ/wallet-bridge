import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { LetterAvatar } from '.'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/LetterAvatar',
  component: LetterAvatar,
  args: {
    data: '1231234234',
  },
  argTypes: {
    data: { type: 'string' },
    className: { type: 'string' },
  },
} as ComponentMeta<typeof LetterAvatar>

const Template: ComponentStory<typeof LetterAvatar> = (args) => <LetterAvatar {...args} />

export const Example = Template.bind({})
