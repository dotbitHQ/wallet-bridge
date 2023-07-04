import { ComponentMeta, ComponentStory } from '@storybook/react'
import { EnhanceSecurity } from '.'
import { SimpleRouter } from '../../components/SimpleRouter'

export default {
  title: 'UI/EnhanceSecurity',
  component: EnhanceSecurity,
} as ComponentMeta<typeof EnhanceSecurity>

const TemplateDefault: ComponentStory<typeof EnhanceSecurity> = () => {
  return <SimpleRouter initialRouteName="index" onClose={() => {}} routes={{ index: { el: <EnhanceSecurity /> } }} />
}

export const DefaultEnhanceSecurity = TemplateDefault.bind({})
