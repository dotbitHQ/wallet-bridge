import { ComponentMeta, ComponentStory } from '@storybook/react'
import { FinalConfirm } from '.'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default {
  title: 'UI/FinalConfirm',
  component: FinalConfirm,
} as ComponentMeta<typeof FinalConfirm>

const queryClient = new QueryClient()

const TemplateDefault: ComponentStory<typeof FinalConfirm> = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <FinalConfirm />
    </QueryClientProvider>
  )
}

export const DefaultFinalConfirm = TemplateDefault.bind({})
