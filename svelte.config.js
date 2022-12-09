import preprocess from 'svelte-preprocess'
import { configs } from './configs.js'
import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: preprocess(),

	kit: {
		adapter: adapter({ out: 'build' }),
		alias: configs.alias,
		env: {
			dir: process.cwd()
		}
	},
}


export default config
