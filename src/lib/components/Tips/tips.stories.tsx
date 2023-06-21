import { Button } from '../Button'
import { Tips, createTips } from '../Tips'

export default {
  title: 'Components/Tips',
  component: Tips,
}

const TemplateTips = () => {
  const onClick = () => {
    createTips({
      title: 'Tips',
      content: 'This is a tips',
      confirmBtnText: 'OK',
      onConfirm: () => {
        alert('confirm')
      },
      onClose: () => {
        alert('close')
      },
    })
  }

  return (
    <>
      <Button onClick={onClick}>Tips</Button>
    </>
  )
}

export const CreateTips = TemplateTips.bind({})
