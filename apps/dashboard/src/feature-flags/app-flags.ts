import type { Flag } from './feature-flags'

const environment = {
  PROD: 'prod',
  DEV: 'dev'
}

export const appFlags = (env: keyof typeof environment): Readonly<Flag[]> =>
  [
    {
      id: 'cookie-banner',
      description: 'Display cookie banner from one trust',
      enabled: {
        [environment.DEV]: false,
        [environment.PROD]: true
      }[environment[env]]!
    },
    {
      id: 'google-tag-manager',
      description: 'Google Tag Manager script tag',
      enabled: {
        [environment.DEV]: false,
        [environment.PROD]: true
      }[environment[env]]!
    }
  ] as const
