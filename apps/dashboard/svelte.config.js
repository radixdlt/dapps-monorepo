import sharedConfig from '../../packages/ui/svelte.config.js'

globalThis.self = globalThis

/** @type {import('@sveltejs/kit').Config} */
const config = {
  ...sharedConfig,

  kit: {
    ...sharedConfig.kit
  }
}

export default config
