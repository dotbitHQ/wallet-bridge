import { ComponentMeta, ComponentStory } from '@storybook/react'
import { TransactionSucceeded } from '.'

export default {
  title: 'UI/TransactionSucceeded',
  component: TransactionSucceeded,
} as ComponentMeta<typeof TransactionSucceeded>

const TemplateDefault: ComponentStory<typeof TransactionSucceeded> = () => {
  return <TransactionSucceeded />
}

export const DefaultFinalConfirm = TemplateDefault.bind({})
