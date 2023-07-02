import { ComponentMeta, ComponentStory } from '@storybook/react'
import { ChooseEmoji } from '.'
import { SimpleRouter } from '../../components/SimpleRouter'

export default {
  title: 'UI/ChooseEmoji',
  component: ChooseEmoji,
} as ComponentMeta<typeof ChooseEmoji>

const TemplateDefault: ComponentStory<typeof ChooseEmoji> = () => {
  return <SimpleRouter initialRouteName="index" onClose={() => {}} routes={{ index: { el: <ChooseEmoji /> } }} />
}

export const DefaultChooseEmoji = TemplateDefault.bind({})
