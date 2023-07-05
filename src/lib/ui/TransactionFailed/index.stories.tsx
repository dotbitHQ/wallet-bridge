import { ComponentMeta, ComponentStory } from '@storybook/react'
import { TransactionFailed } from '.'
import { SimpleRouter } from '../../components/SimpleRouter'

export default {
  title: 'UI/TransactionFailed',
  component: TransactionFailed,
} as ComponentMeta<typeof TransactionFailed>

const TemplateDefault: ComponentStory<typeof TransactionFailed> = () => {
  return <SimpleRouter initialRouteName="index" onClose={() => {}} routes={{ index: { el: <TransactionFailed /> } }} />
}

export const DefaultFinalConfirm = TemplateDefault.bind({})
