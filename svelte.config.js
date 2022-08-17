import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'
import { configs } from './configs'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		prerender: {
			default: true
		},
		alias: configs.alias
	}
}


export default config
