import { sveltekit } from '@sveltejs/kit/vite'
globalThis.self = globalThis

/** @type {import('vite').UserConfigFn} */
const config = ({ command }) => ({
	plugins: [
		sveltekit()
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
				assetsInlineLimit: 0,
				minify: true,
				sourcemap: false
			}
		}
	}[command]))()
})

export default config
