import adapter from '@sveltejs/adapter-auto'
import preprocess from 'svelte-preprocess'

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
			'@types': 'src/types.ts'
		}
	}
}

export default config
