import react from '@vitejs/plugin-react'
import preact from '@preact/preset-vite'
import path from 'node:path'
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'
import tailwindcss from 'tailwindcss'
import { UserConfigExport } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import alias from '@rollup/plugin-alias'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

import { name } from './package.json'

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    plugins: [
      alias({
        entries: [
          { find: 'react', replacement: 'preact/compat' },
          { find: 'react-dom/test-utils', replacement: 'preact/test-utils' },
          { find: 'react-dom', replacement: 'preact/compat' },
          { find: 'react/jsx-runtime', replacement: 'preact/jsx-runtime' },
        ],
      }),
      preact(),
      cssInjectedByJsPlugin(),
      // dts({
      //   insertTypesEntry: true,
      // }),
      // visualizer({
      //   template: "treemap", // or sunburst
      //   open: true,
      //   gzipSize: true,
      //   brotliSize: true,
      //   filename: "analyse.html", // will be saved in project's root
      // })
    ],
    css: {
      postcss: {},
    },
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/lib/index.ts'),
        name,
        formats: ['es', 'umd'],
        fileName: (format) => `${name}.${format}.js`,
      },
      rollupOptions: {
        treeshake: 'smallest',
        // external: ['react', 'react-dom', 'tailwindcss'],
        // output: {
        //   globals: {
        //     react: 'React',
        //     'react-dom': 'ReactDOM',
        //     tailwindcss: 'tailwindcss',
        //   },
        // },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
    },
  })
}
// https://vitejs.dev/config/
export default app
