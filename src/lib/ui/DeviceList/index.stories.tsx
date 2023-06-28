import { ComponentMeta, ComponentStory } from '@storybook/react'
import { DeviceList } from '.'

export default {
  title: 'UI/DeviceList',
  component: DeviceList,
} as ComponentMeta<typeof DeviceList>

const TemplateDefault: ComponentStory<typeof DeviceList> = () => {
  return <DeviceList />
}

export const DefaultDeviceList = TemplateDefault.bind({})
