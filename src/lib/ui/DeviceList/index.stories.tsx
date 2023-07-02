import { ComponentMeta, ComponentStory } from '@storybook/react'
import { DeviceList } from '.'
import { SimpleRouter } from '../../components/SimpleRouter'

export default {
  title: 'UI/DeviceList',
  component: DeviceList,
} as ComponentMeta<typeof DeviceList>

const TemplateDefault: ComponentStory<typeof DeviceList> = () => {
  return <SimpleRouter initialRouteName="index" onClose={() => {}} routes={{ index: { el: <DeviceList /> } }} />
}

export const DefaultDeviceList = TemplateDefault.bind({})
