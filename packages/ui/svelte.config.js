import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-node'
import { aliases } from '../../aliases.js'
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    scss: {
      prependData: `@use "${join(__dirname, '/src/global.scss').replace(/\\/g, '/')}"; @use "${join(__dirname, '/src/mixins.scss').replace(/\\/g, '/')}";`
    }
  }),

  onwarn: (warning, handler) => {
    if (warning.code.startsWith('a11y-') || warning.code.startsWith('css-unused-selector')) return

    handler(warning)
  },

  kit: {
    adapter: adapter({ out: 'build' }),
    alias: aliases(),
    env: {
      dir: process.cwd()
    }
  }
}

export default config
