import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { Tag, TagProps, TagVariant } from './index'
import { objectValuesToControls } from '../../storybook-utils'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Components/Tag',
  component: Tag,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    variant: objectValuesToControls(TagVariant),
  },
} as ComponentMeta<typeof Tag>

const Template: ComponentStory<typeof Tag> = (args: TagProps) => <Tag {...args} />

export const Example = Template.bind({})

Example.args = {
  children: 'Tag',
  variant: TagVariant.default,
}
