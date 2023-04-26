export const Network = {
  HAMMUNET: 'hammunet',
  ENKINET: 'enkinet',
  GILGANET: 'gilganet',
  KISHARNET: 'kisharnet'
} as const

export const NETWORK_CONFIG = {
  [Network.HAMMUNET]: {
    id: 34,
    url: 'https://hammunet-gateway.radixdlt.com:443',
    dappDefAddress:
      'account_tdx_22_1prtqhxd5mmq2nj3mrhcztxphauy29qeuk5walu49spjsqpjxr6'
  },
  [Network.ENKINET]: {
    id: 33,
    url: 'https://enkinet-gateway.radixdlt.com',
    dappDefAddress:
      'account_tdx_21_1p9jzyn8vguadl8jhgcp0e0e7wtneurm36wadgn3460eqm93rq0'
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
  }
} as const

export const XRD_NAME = 'Radix'
