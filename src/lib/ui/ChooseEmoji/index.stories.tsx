import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ChooseEmoji } from '.'

export default {
  title: 'UI/ChooseEmoji',
  component: ChooseEmoji,
} as ComponentMeta<typeof ChooseEmoji>

const TemplateDefault: ComponentStory<typeof ChooseEmoji> = () => {
  return <ChooseEmoji />
}

export const DefaultChooseEmoji = TemplateDefault.bind({})
