import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { configs } from './configs'
import path from 'path'

const mappedAliases = Object.entries(configs.alias).reduce(
  (obj, [key, value]) => ({
    [key]: path.resolve(__dirname, value),
    ...obj
  }),
  {}
)

export default defineConfig({
  plugins: [svelte({ hot: !process.env.VITEST })],
  resolve: {
    alias: {
      ...mappedAliases,
      $app: '/node_modules/@sveltejs/kit/assets/app'
    }
  },
  test: {
    setupFiles: ['./setup-tests.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['text', 'lcov']
    }
  }
})
