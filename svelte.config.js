import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'
import { configs } from './configs.js'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		prerender: {
			default: true
		},
		alias: {
			'@components': 'src/components',
			'@styles': 'src/styles.ts',
			'@types': 'src/types.ts',
			'@sdk': 'src/mock-sdk.ts',
			'@stores': 'src/stores.ts',
			'@utils': 'src/utils/utils.ts',
			'@configs': 'configs.js'
		}
	}
}


export default config
