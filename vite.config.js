import { sveltekit } from '@sveltejs/kit/vite'
import { configs } from './configs.js'

/** @type {import('vite').UserConfigFn} */
const config = ({ command }) => ({
	plugins: [!configs.flags.isVitebook ? sveltekit() : null],
	server: {
		fs: {
			allow: ['.']
		}
	},
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
