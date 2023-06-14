import { sveltekit } from '@sveltejs/kit/vite'
import { configs } from './configs'

/** @type {import('vite').UserConfigFn} */
const config = ({ command }) => ({
	plugins: [
		!configs.flags.isVitebook ? sveltekit() : null
	],
	...(() => ({
		serve: {
			build: {
				minify: false,
				sourcemap: true
			}
		},
		build: {
			build: {
				minify: true,
				sourcemap: false
			}
		}
	}[command]))()
})

export default config
