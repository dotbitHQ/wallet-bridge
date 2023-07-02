import { ComponentMeta, ComponentStory } from '@storybook/react'
import { TransactionStatus } from '.'
import { SimpleRouter } from '../../components/SimpleRouter'

export default {
  title: 'UI/TransactionStatus',
  component: TransactionStatus,
} as ComponentMeta<typeof TransactionStatus>

const TemplateDefault: ComponentStory<typeof TransactionStatus> = () => {
  return <SimpleRouter initialRouteName="index" onClose={() => {}} routes={{ index: { el: <TransactionStatus /> } }} />
}

export const DefaultFinalConfirm = TemplateDefault.bind({})
