import type { Flag } from './feature-flags'

const environment = {
  PROD: 'prod',
  DEV: 'dev'
}

export const appFlags = (env: keyof typeof environment): Readonly<Flag[]> =>
  [
    {
      id: 'deploy-package',
      description: 'Deploy package in the sidebar menu',
      enabled: true
    },
    {
      id: 'transaction-manifest',
      description: 'Transaction Manifest in the sidebar menu',
      enabled: true
    },
    {
      id: 'send-tokens',
      description: 'Send Tokens in the sidebar menu',
      enabled: true
    },
    {
      id: 'send-nft',
      description: 'Send NFTs in the sidebar menu',
      enabled: true
    },
    {
      id: 'dark-mode',
      description: 'Display the toggle for dark mode',
      enabled: {
        [environment.DEV]: true,
        [environment.PROD]: false
      }[environment[env]]!
    },
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
