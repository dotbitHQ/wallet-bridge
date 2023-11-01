import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vitest/config'
import { UserConfigExport } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { name } from './package.json'
import lingui from '@lingui/vite-plugin'

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    plugins: [
      react({
        babel: {
          plugins: ["macros"],
        },
      }),
      lingui(),
      // visualizer({
      //   template: "treemap", // or sunburst
      //   open: true,
      //   gzipSize: true,
      //   brotliSize: true,
      //   filename: "analyse.html", // will be saved in project's root
      // })
    ],
    build: {
      minify: true,
      lib: {
        entry: path.resolve(__dirname, 'src/lib/index.ts'),
        name,
        formats: ['umd'],
        fileName: (format) => `${name}.${format}.js`,
      },
      rollupOptions: {
        treeshake: 'smallest',
        external: ['react', 'react-dom', 'tailwindcss'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            tailwindcss: 'tailwindcss',
          },
        },
        /**
         * Ignore "use client" waning since we are not using SSR
         * @see {@link https://github.com/TanStack/query/pull/5161#issuecomment-1477389761 Preserve 'use client' directives TanStack/query#5161}
         */
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && warning.message.includes(`"use client"`)) {
            return
          }
          warn(warning)
        },
      },
    },
  })
}
// https://vitejs.dev/config/
export default app
