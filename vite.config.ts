import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'
import tailwindcss from 'tailwindcss'
import { UserConfigExport } from 'vite'
import { lingui } from '@lingui/vite-plugin'
import { visualizer } from 'rollup-plugin-visualizer'
import { name, dependencies, peerDependencies } from './package.json'

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    plugins: [
      react({
        babel: {
          plugins: ["macros"],
        },
      }),
      lingui(),
      dts({
        insertTypesEntry: true,
      }),
      
      // visualizer({
      //   template: "treemap", // or sunburst
      //   open: true,
      //   gzipSize: true,
      //   brotliSize: true,
      //   filename: "analyse.html", // will be saved in project's root
      // })
    ],
    css: {
      postcss: {
        plugins: [tailwindcss],
      },
    },
    build: {
      emptyOutDir: false,
      minify: false,
      lib: {
        entry: path.resolve(__dirname, 'src/lib/index.ts'),
        name,
        formats: ['es'],
        fileName: (format) => `${name}.${format}.js`,
      },
      rollupOptions: {
        external: [
          ...Object.keys(dependencies || {}),
          ...Object.keys(peerDependencies || {}),
          'react/jsx-runtime',
          'react-is',
          'react-transition-group/Transition',
        ],
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
