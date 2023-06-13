import { Dialog } from './index'
import { ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { Button } from '../Button'

export default {
  title: 'Components/Dialog',
  component: Dialog,
}

const TemplateDefaultDialog: ComponentStory<typeof Dialog> = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true)
        }}
      >
        Open Dialog
      </Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
        title="Dialog Title"
      >
        <div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
        </div>
      </Dialog>
    </>
  )
}

export const DefaultDialog = TemplateDefaultDialog.bind({})

const TemplateDialogWithGoBack: ComponentStory<typeof Dialog> = () => {
  const [isOpen, setIsOpen] = useState(false)

  const goBack = () => {
    alert('go back')
  }

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true)
        }}
      >
        Open Dialog with Go Back
      </Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
        goBack={goBack}
        title="Dialog Title"
      >
        <div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
        </div>
      </Dialog>
    </>
  )
}

export const DialogWithGoBack = TemplateDialogWithGoBack.bind({})

const TemplateDialogNoTitle: ComponentStory<typeof Dialog> = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true)
        }}
      >
        Dialog No Title
      </Button>
      <Dialog
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
      >
        <div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
        </div>
      </Dialog>
    </>
  )
}

export const DialogNoTitle = TemplateDialogNoTitle.bind({})
