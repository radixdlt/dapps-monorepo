import preprocess from 'svelte-preprocess'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import sharedConfig from '../../packages/svelte-ui/src/lib/common-svelte-config.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('@sveltejs/kit').Config} */
const config = {
	...sharedConfig,
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: preprocess({
		scss: {
			prependData: `@use "${join(__dirname, '/src/lib/global.scss').replace(
				/\\/g,
				'/'
			)}"; @use "${join(__dirname, '/src/lib/mixins.scss').replace(/\\/g, '/')}";`
		}
	}),
};

export default config;
