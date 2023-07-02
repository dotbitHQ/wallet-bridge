import { ComponentMeta, ComponentStory } from '@storybook/react'
import { FinalConfirm } from '.'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SimpleRouter } from '../../components/SimpleRouter'

export default {
  title: 'UI/FinalConfirm',
  component: FinalConfirm,
} as ComponentMeta<typeof FinalConfirm>

const queryClient = new QueryClient()

const TemplateDefault: ComponentStory<typeof FinalConfirm> = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SimpleRouter initialRouteName="index" onClose={() => {}} routes={{ index: { el: <FinalConfirm /> } }} />
    </QueryClientProvider>
  )
}

export const DefaultFinalConfirm = TemplateDefault.bind({})
