import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-node'
import { aliases } from '../../aliases.js'

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
    alias: aliases(),
    env: {
      dir: '../../'
    }
  }
}

export default config
