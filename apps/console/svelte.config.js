import preprocess from 'svelte-preprocess'
import adapter from 'svelte-adapter-bun'
import { aliases } from '../../aliases.js'
globalThis.self = globalThis

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess(),

  kit: {
    adapter: adapter({ out: 'build' }),
    alias: aliases(),
    env: {
      dir: process.cwd()
    },
    csp: {
      mode: 'auto',
      directives: {
        'default-src': ['self'],
        'style-src': [
          'self',
          'unsafe-inline',
          'https://fonts.googleapis.com/css2',
          'https://fonts.cdnfonts.com/css/hack'
        ],
        'font-src': [
          'self',
          'https://fonts.gstatic.com',
          'https://fonts.cdnfonts.com/s/16184/Hack-Regular.woff',
          'https://fonts.cdnfonts.com/s/16184/Hack-Italic.woff',
          'https://fonts.cdnfonts.com/s/16184/Hack-Bold.woff',
          'https://fonts.cdnfonts.com/s/16184/Hack-BoldItalic.woff',
          'data:'
        ],
        'img-src': [
          'self',
          'data:',
          'https://cdn-ukwest.onetrust.com',
          'https://image-service-dev.extratools.works'
        ],
        'connect-src': [
          'self',
          'https://*.radixdlt.com',
          'https://cdn-ukwest.onetrust.com',
          'https://geolocation.onetrust.com/cookieconsentpub/v1/geo/location'
        ],
        'script-src': ['self', 'https://cdn-ukwest.onetrust.com']
      }
    }
  }
}

export default config
