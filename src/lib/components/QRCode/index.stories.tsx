import { ComponentMeta, ComponentStory } from '@storybook/react'
import { QRCode } from '.'

export default {
  title: 'Components/QRCode',
  component: QRCode,
  args: {
    data: 'https://test.com',
    width: 300,
    height: 300,
    dotsOptions: {
      type: 'dots',
    },
    cornersDotOptions: {
      type: 'dot',
    },
    cornersSquareOptions: {
      type: 'extra-rounded',
    },
  },
  argTypes: {
    data: { type: 'string' },
    width: { type: 'number' },
    height: { type: 'number' },
    dotsOptions: {
      type: {
        name: 'object',
        value: {
          type: { name: 'enum', value: ['dots', 'rounded', 'classy', 'classy-rounded', 'square', 'extra-rounded'] },
          color: { name: 'string' },
        },
      },
    },
    cornersDotOptions: {
      type: {
        name: 'object',
        value: {
          type: { name: 'enum', value: ['dot', 'square'] },
          color: { name: 'string' },
        },
      },
    },
    cornersSquareOptions: {
      type: {
        name: 'object',
        value: {
          type: { name: 'enum', value: ['dot', 'square', 'extra-rounded'] },
          color: { name: 'string' },
        },
      },
    },
  },
} as ComponentMeta<typeof QRCode>

export const Template: ComponentStory<typeof QRCode> = function (args) {
  return <QRCode {...args} />
}
