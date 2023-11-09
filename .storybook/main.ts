import { StorybookViteConfig } from '@storybook/builder-vite'

import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { lingui } from '@lingui/vite-plugin'
import { mergeConfig } from 'vite'

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
    config.plugins = config.plugins?.filter((i) => {
      if (i instanceof Array) {
        return !i.some((item: any) => item.name === 'vite:react-babel')
      } else {
        return true
      }
    })
    const res = mergeConfig(config, {
      plugins: [
        react({
          babel: {
            plugins: ['macros'],
          },
        }),
        lingui(),
      ],
    })
    return res
  },
  features: {
    storyStoreV7: true,
    // babelModeV7: true
  },
}

module.exports = config
