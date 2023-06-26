import { ComponentMeta, ComponentStory } from '@storybook/react'
import { FinalConfirm } from '.'

export default {
  title: 'UI/FinalConfirm',
  component: FinalConfirm,
} as ComponentMeta<typeof FinalConfirm>

const TemplateDefault: ComponentStory<typeof FinalConfirm> = () => {
  return <FinalConfirm />
}

export const DefaultFinalConfirm = TemplateDefault.bind({})
