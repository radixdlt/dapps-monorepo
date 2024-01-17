import { defineConfig } from 'vitest/config'
import path from 'path'
import { aliases } from '../../aliases'
import { sveltekit } from '@sveltejs/kit/vite'

const mappedAliases = Object.entries(aliases()).reduce(
  (obj, [key, value]) => ({
    [key]: path.resolve(__dirname, value),
    ...obj
  }),
  {}
)

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      ...mappedAliases,
      $app: '/node_modules/@sveltejs/kit/assets/app'
    }
  },
  test: {
    setupFiles: ['../../setup-tests.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        runScripts: 'dangerously',
        resources: 'usable'
      }
    },
    coverage: {
      reporter: ['text', 'lcov']
    }
  }
})
