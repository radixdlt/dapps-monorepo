import { sveltekit } from '@sveltejs/kit/vite'
import { isVitebook } from './configs.js'

/** @type {import('vite').UserConfigFn} */
const config = ({ command }) => ({
	plugins: [!isVitebook ? sveltekit() : null],
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
