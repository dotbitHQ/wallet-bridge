import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { Button, ButtonProps, BUTTON_VARIANT } from './index'
import { objectValuesToControls } from '../../storybook-utils'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'components/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    label: { control: 'text' },
    variant: objectValuesToControls(BUTTON_VARIANT),
    onClick: { action: 'clicked' },
  },
} as ComponentMeta<typeof Button>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Button> = (args: ButtonProps) => <Button {...args} />

export const Primary = Template.bind({})
// More on args: https://storybook.js.org/docs/react/writing-stories/args
Primary.args = {
  label: 'Button',
  variant: 'PRIMARY',
  onClick: () => {
    alert('clicking primary')
  },
}

export const Secondary = Template.bind({})
Secondary.args = {
  label: 'Button',
  variant: 'SECONDARY',
}

export const Tertiary = Template.bind({})
Tertiary.args = {
  label: 'Button',
  variant: 'TERTIARY',
}

export const Disabled = Template.bind({})
Disabled.args = {
  label: 'Button',
  isDisabled: true,
}
