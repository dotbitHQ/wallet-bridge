import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vitest/config'
import { UserConfigExport } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { name } from './package.json'

const app = async (): Promise<UserConfigExport> => {
  return defineConfig({
    plugins: [
      react(),
      // visualizer({
      //   template: "treemap", // or sunburst
      //   open: true,
      //   gzipSize: true,
      //   brotliSize: true,
      //   filename: "analyse.html", // will be saved in project's root
      // })
    ],
    build: {
      emptyOutDir: false,
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
      },
    },
  })
}
// https://vitejs.dev/config/
export default app
