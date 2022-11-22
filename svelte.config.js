import preprocess from 'svelte-preprocess'
import { configs } from './configs.js'
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		adapter: adapter({ fallback: 'fallback.html' }),
		alias: configs.alias,
		env: {
			dir: process.cwd()
		}
	},
}


export default config
