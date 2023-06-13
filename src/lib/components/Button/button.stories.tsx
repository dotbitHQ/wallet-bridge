import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Button, ButtonProps, ButtonShape, ButtonSize, ButtonVariant } from './index'
import { objectValuesToControls } from '../../storybook-utils'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    variant: objectValuesToControls(ButtonVariant),
    size: objectValuesToControls(ButtonSize),
    shape: objectValuesToControls(ButtonShape),
  },
} as ComponentMeta<typeof Button>

const Template: ComponentStory<typeof Button> = (args: ButtonProps) => <Button {...args} />

export const Example = Template.bind({})

Example.args = {
  children: 'Button',
  variant: ButtonVariant.primary,
  size: ButtonSize.middle,
  shape: ButtonShape.round,
  loading: false,
  disabled: false,
  outlink: false,
  onClick: () => {
    alert('clicking primary')
  },
}
