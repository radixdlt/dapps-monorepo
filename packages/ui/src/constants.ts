export const Network = {
  HAMMUNET: 'hammunet',
  ENKINET: 'enkinet',
  GILGANET: 'gilganet',
  KISHARNET: 'kisharnet',
  RCNET: 'rcnet'
} as const

export const NETWORK_CONFIG = {
  [Network.HAMMUNET]: {
    id: 34,
    url: 'https://hammunet-gateway.radixdlt.com:443',
    dappDefAddress:
      'account_tdx_22_128eksrhxcm5chjwkaz5y4mrveqzxg5l96fj6u7hg9pj978c8h4x2ft'
  },
  [Network.ENKINET]: {
    id: 33,
    url: 'https://enkinet-gateway.radixdlt.com',
    dappDefAddress:
      'account_tdx_21_129c3uarzmguw2rtmmuq3hv0eycktvj3achtzzkh5qra4ctsv6nl5fu'
  },
  [Network.GILGANET]: {
    id: 32,
    url: 'https://gilganet-gateway.radixdlt.com',
    dappDefAddress:
      'account_tdx_22_1prtqhxd5mmq2nj3mrhcztxphauy29qeuk5walu49spjsqpjxr6'
  },
  [Network.KISHARNET]: {
    id: 12,
    url: 'https://kisharnet-gateway.radixdlt.com',
    dappDefAddress:
      'account_tdx_c_1p9v4tvz7uske6ts02hpjqr9q8enatw3wfw6mcmf699nqz3wfdl'
  },
  [Network.RCNET]: {
    id: 12,
    url: 'https://kisharnet-gateway.radixdlt.com',
    dappDefAddress:
      'account_tdx_c_1p9v4tvz7uske6ts02hpjqr9q8enatw3wfw6mcmf699nqz3wfdl'
  }
} as const

export const XRD_NAME = 'Radix'
export const XRD_SYMBOL = 'XRD'
