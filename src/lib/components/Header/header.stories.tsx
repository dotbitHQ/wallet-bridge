import { Header } from './index'
import { ComponentMeta, ComponentStory } from '@storybook/react'

export default {
  title: 'Components/Header',
  component: Header,
} as ComponentMeta<typeof Header>

const TemplateDefaultHeader: ComponentStory<typeof Header> = () => {
  const onClose = () => {
    alert('clicked close.')
  }
  return <Header title="Test title" onClose={onClose}></Header>
}

export const DefaultHeader = TemplateDefaultHeader.bind({})

const TemplateHeaderWithGoBack: ComponentStory<typeof Header> = () => {
  const onClose = () => {
    alert('clicked close.')
  }

  const goBack = () => {
    alert('clicked back.')
  }

  return <Header title="Test title" onClose={onClose} goBack={goBack}></Header>
}

export const HeaderWithGoBack = TemplateHeaderWithGoBack.bind({})

const TemplateHeaderNoTitle: ComponentStory<typeof Header> = () => {
  const onClose = () => {
    alert('clicked close.')
  }

  return <Header onClose={onClose}></Header>
}

export const HeaderNoTitle = TemplateHeaderNoTitle.bind({})
