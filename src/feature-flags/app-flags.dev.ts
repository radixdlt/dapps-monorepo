export const devAppFlags = [
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
    id: 'dark-mode',
    description: 'Display the toggle for dark mode',
    enabled: true
  },
  {
    id: 'cookie-banner',
    description: 'Display cookie banner from one trust',
    enabled: false
  },
  {
    id: 'xstate-inspect',
    description: 'Turn on xstate inspect',
    enabled: false
  }
] as const
