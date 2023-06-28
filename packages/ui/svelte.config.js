import preprocess from 'svelte-preprocess'
import { configs } from './configs.js'
import adapter from '@sveltejs/adapter-node'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),
  onwarn: (warning, handler) => {
    if (warning.code.startsWith('a11y-')) {
      return
    }
    handler(warning)
  },
  kit: {
    adapter: adapter({ out: 'build' }),
    alias: configs.alias,
    env: {
      dir: process.cwd()
    }
  }
}

export default config
