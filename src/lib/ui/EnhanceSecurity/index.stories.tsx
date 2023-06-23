import { ComponentMeta, ComponentStory } from '@storybook/react'
import { EnhanceSecurity } from '.'

export default {
  title: 'UI/EnhanceSecurity',
  component: EnhanceSecurity,
} as ComponentMeta<typeof EnhanceSecurity>

const TemplateDefault: ComponentStory<typeof EnhanceSecurity> = () => {
  return <EnhanceSecurity />
}

export const DefaultEnhanceSecurity = TemplateDefault.bind({})
