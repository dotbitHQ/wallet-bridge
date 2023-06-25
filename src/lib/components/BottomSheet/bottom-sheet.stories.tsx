import { BottomSheet } from './index'
import { ComponentStory } from '@storybook/react'
import { useState } from 'react'
import { Button } from '../Button'

export default {
  title: 'Components/BottomSheet',
  component: BottomSheet,
}

const TemplateDefaultBottomSheet: ComponentStory<typeof BottomSheet> = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true)
        }}
      >
        Open BottomSheet
      </Button>
      <BottomSheet
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
        title="BottomSheet Title"
      >
        <div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
          <div>Some contents...</div>
        </div>
      </BottomSheet>
    </>
  )
}

export const DefaultBottomSheet = TemplateDefaultBottomSheet.bind({})

const TemplateBottomSheetWithGoBack: ComponentStory<typeof BottomSheet> = () => {
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
        Open BottomSheet with Go Back
      </Button>
      <BottomSheet
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false)
        }}
        goBack={goBack}
        title="BottomSheet Title"
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
      </BottomSheet>
    </>
  )
}

export const BottomSheetWithGoBack = TemplateBottomSheetWithGoBack.bind({})

const TemplateBottomSheetNoTitle: ComponentStory<typeof BottomSheet> = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true)
        }}
      >
        BottomSheet No Title
      </Button>
      <BottomSheet
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
      </BottomSheet>
    </>
  )
}

export const BottomSheetNoTitle = TemplateBottomSheetNoTitle.bind({})
