import { Toast, createToast } from './index'
import { ComponentStory } from '@storybook/react'
import { Button } from '../Button'
import { copyText } from '../../utils'

export default {
  title: 'Components/Toast',
  component: Toast,
}

const TemplateDefaultToast: ComponentStory<typeof Toast> = () => {
  const onCopy = () => {
    copyText('a message').then(() => {
      createToast({
        message: '👌 Copied',
      })
    })
  }

  return (
    <>
      <Button onClick={onCopy}>copy message</Button>
    </>
  )
}

export const DefaultToast = TemplateDefaultToast.bind({})
