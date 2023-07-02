import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ShowQRCode } from '.'
import { SimpleRouter } from '../../components/SimpleRouter'

export default {
  title: 'UI/ShowQRCode',
  component: ShowQRCode,
} as ComponentMeta<typeof ShowQRCode>

const TemplateDefault: ComponentStory<typeof ShowQRCode> = () => {
  return <SimpleRouter initialRouteName="index" onClose={() => {}} routes={{ index: { el: <ShowQRCode /> } }} />
}

export const DefaultShowQRCode = TemplateDefault.bind({})
