import { ComponentMeta, ComponentStory } from '@storybook/react'
import { InputSignature } from '.'
import { SimpleRouter } from '../../components/SimpleRouter'

export default {
  title: 'UI/InputSignature',
  component: InputSignature,
} as ComponentMeta<typeof InputSignature>

const TemplateDefault: ComponentStory<typeof InputSignature> = () => {
  return <SimpleRouter initialRouteName="index" onClose={() => {}} routes={{ index: { el: <InputSignature /> } }} />
}

export const DefaultInputSignature = TemplateDefault.bind({})
