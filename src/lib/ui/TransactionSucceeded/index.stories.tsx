import { ComponentMeta, ComponentStory } from '@storybook/react'
import { TransactionSucceeded } from '.'
import { SimpleRouter } from '../../components/SimpleRouter'

export default {
  title: 'UI/TransactionSucceeded',
  component: TransactionSucceeded,
} as ComponentMeta<typeof TransactionSucceeded>

const TemplateDefault: ComponentStory<typeof TransactionSucceeded> = () => {
  return (
    <SimpleRouter initialRouteName="index" onClose={() => {}} routes={{ index: { el: <TransactionSucceeded /> } }} />
  )
}

export const DefaultFinalConfirm = TemplateDefault.bind({})
