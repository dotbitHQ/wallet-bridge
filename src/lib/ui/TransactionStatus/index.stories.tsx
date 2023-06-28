import { ComponentMeta, ComponentStory } from '@storybook/react'
import { TransactionStatus } from '.'

export default {
  title: 'UI/TransactionStatus',
  component: TransactionStatus,
} as ComponentMeta<typeof TransactionStatus>

const TemplateDefault: ComponentStory<typeof TransactionStatus> = () => {
  return <TransactionStatus />
}

export const DefaultFinalConfirm = TemplateDefault.bind({})
