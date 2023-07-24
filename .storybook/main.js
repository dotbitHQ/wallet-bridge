const { mergeConfig } = require('vite')
const { nodePolyfills } = require('vite-plugin-node-polyfills')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-postcss',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-vite',
  },
  features: {
    storyStoreV7: true,
  },
  async viteFinal(config) {
    // Merge custom configuration into the default config
    return mergeConfig(config, {
      // Use the same "resolve" configuration as your app
      // resolve: (await import('../vite.config.js')).default.resolve,
      // // Add dependencies to pre-optimization
      // optimizeDeps: {
      //   include: ['storybook-dark-mode'],
      // },
      plugins: [
        nodePolyfills({
          globals: {
            Buffer: true,
            global: true,
          },
        }),
      ],
    })
  },
}
