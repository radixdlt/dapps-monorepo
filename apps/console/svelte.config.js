import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-node'
import { aliases } from '../../aliases.js'
globalThis.self = globalThis

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),

  kit: {
    adapter: adapter({ out: 'build' }),
    alias: aliases(),
    env: {
      dir: process.cwd()
    },
    csp: {
      mode: 'auto',
      directives: {
        'default-src': ['self']
      }
    }
  }
}

export default config
