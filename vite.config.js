import { sveltekit } from '@sveltejs/kit/vite'

/** @type {import('vite').UserConfigFn} */
const config = ({ command }) => ({
	plugins: [sveltekit()],
	...(() => ({
		serve: {
			build: {
				minify: false,
				sourcemap: true
			}
		},
		build: {
			build: {}
		}
	}[command]))()
})

export default config
