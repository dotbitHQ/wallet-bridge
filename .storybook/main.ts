import { StorybookViteConfig } from "@storybook/builder-vite"

const react = require('@vitejs/plugin-react')
const dts = require('vite-plugin-dts')
const { lingui } = require('@lingui/vite-plugin')
const { mergeConfig } = require('vite')

const config: StorybookViteConfig = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-postcss',
    'storybook-addon-linguijs',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
  },
  async viteFinal(config, options) {
    const res =  mergeConfig(config, {
      plugins: lingui(),
    })
    return res 
  },
  features: {
    storyStoreV7: true,
    // babelModeV7: true
  },
}

module.exports = config