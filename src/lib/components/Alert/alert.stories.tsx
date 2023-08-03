import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Alert, AlertProps, AlertType } from './index'
import { objectValuesToControls } from '../../storybook-utils'
import { NoticeIcon } from '../Icons'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Alert',
  component: Alert,
  argTypes: {
    type: objectValuesToControls(AlertType),
  },
} as ComponentMeta<typeof Alert>

const Template: ComponentStory<typeof Alert> = (args: AlertProps) => <Alert {...args} />

export const Example = Template.bind({})

Example.args = {
  children: 'Some contents...',
  type: AlertType.warning,
}

const TemplateWithIcon = () => {
  return (
    <Alert type={AlertType.warning} icon={<NoticeIcon className="h-[18px] w-[18px] text-[#FFB02E]"></NoticeIcon>}>
      Some contents...
    </Alert>
  )
}

export const WithIcon = TemplateWithIcon.bind({})
