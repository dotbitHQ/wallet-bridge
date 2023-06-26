import { ComponentMeta, ComponentStory } from '@storybook/react'
import { InputSignature } from '.'

export default {
  title: 'UI/InputSignature',
  component: InputSignature,
} as ComponentMeta<typeof InputSignature>

const TemplateDefault: ComponentStory<typeof InputSignature> = () => {
  return <InputSignature />
}

export const DefaultInputSignature = TemplateDefault.bind({})
