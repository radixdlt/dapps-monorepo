import preprocess from 'svelte-preprocess'
import adapter from '@sveltejs/adapter-node'
import { aliases } from '../../aliases.js'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: preprocess({
    scss: {
      prependData: `@use "${join(__dirname, '/src/global.scss').replace(
        /\\/g,
        '/'
      )}"; @use "${join(__dirname, '/src/mixins.scss').replace(/\\/g, '/')}";`
    }
  }),

  onwarn: (warning, handler) => {
    if (
      warning.code.startsWith('a11y-') ||
      warning.code.startsWith('css-unused-selector')
    )
      return

    handler(warning)
  },

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
          'https://px.ads.linkedin.com/',
          'https://www.google.*',
          'https://alb.reddit.com',
          'https://www.googletagmanager.com/',
          'https://t.co/',
          'https://analytics.twitter.com/',
          'https://www.facebook.com/tr/',
          'https://image-service-dev.extratools.works'
        ],
        'connect-src': [
          'self',
          'https://*.radixdlt.com',
          'https://cdn-ukwest.onetrust.com',
          'https://px.ads.linkedin.com/',
          'https://www.google-analytics.com/',
          'https://stats.g.doubleclick.net/',
          'https://region1.analytics.google.com/',
          'https://geolocation.onetrust.com/cookieconsentpub/v1/geo/location',
          'https://region1.google-analytics.com/',
          'https://analytics.tiktok.com/'
        ],
        'script-src': [
          'self',
          'https://cdn-ukwest.onetrust.com',
          'https://tagmanager.google.com/',
          'https://www.googletagmanager.com/',
          'https://www.google-analytics.com/',
          'https://snap.licdn.com/',
          'https://analytics.tiktok.com/',
          'https://static.ads-twitter.com/',
          'https://www.redditstatic.com',
          'https://www.youtube.com',
          'https://connect.facebook.net/',
          'https://px.ads.linkedin.com/',
          'sha256-q6rgKfZKdcn/pHsqOxRfNrKmmys1//WnFYpIdWiu7w0=', // OneTrust
          'sha256-5VrVgGfPbUH5IoPb+tGodpswZad/XDHQfqHeVD0LMG4=', // GTM
          'sha256-iqy3LRnXlk3T3Si5rUUztqoKxwYlK/FGrKGJ3OOwoNU=', // GTM
          'sha256-oYPTcDf2CB/QxInrrYXimXLmzCk11RIF7HUZXWxsRro=', // GTM
          'sha256-ngbR4SH6yZjgS9lO7g7PMF3gp9XC4SVO58ftF59dmnw=' // GTM
        ]
      }
    }
  }
}

export default config
