import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ShowQRCode } from '.'

export default {
  title: 'UI/ShowQRCode',
  component: ShowQRCode,
} as ComponentMeta<typeof ShowQRCode>

const TemplateDefault: ComponentStory<typeof ShowQRCode> = () => {
  return <ShowQRCode />
}

export const DefaultShowQRCode = TemplateDefault.bind({})
