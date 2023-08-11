import xrdIcon from '@icons/xrd-token-icon.svg'

export const Network = {
  HAMMUNET: 'hammunet',
  ENKINET: 'enkinet',
  GILGANET: 'gilganet',
  KISHARNET: 'kisharnet',
  ANSHARNET: 'ansharnet',
  ZABANET: 'zabanet',
  RCNETV3: 'rcnet-v3',
  RCNETV2: 'rcnet-v2',
  RCNET: 'rcnet'
} as const

export const NETWORK_CONFIG = {
  [Network.HAMMUNET]: {
    id: 34,
    url: 'https://hammunet-gateway.radixdlt.com',
    dappDefAddress:
      'account_tdx_22_16xygyhqp3x3awxlz3c5dzrm7jqghgpgs776v4af0yfr7xljqfw9zgy'
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
  [Network.ANSHARNET]: {
    id: 13,
    url: 'https://ansharnet-gateway.radixdlt.com',
    dappDefAddress:
      'account_tdx_d_12x649lyv286g8krpfthv6ne9rw06njn6yp95n303jn5qxq06sznekf'
  },
  [Network.ZABANET]: {
    id: 14,
    url: 'https://zabanet-gateway.radixdlt.com',
    dappDefAddress:
      ''
  },
  [Network.RCNETV3]: {
    id: 14,
    url: 'https://zabanet-gateway.radixdlt.com',
    dappDefAddress:
      'account_tdx_e_randomtobefilledin12345'
  },
  [Network.RCNETV2]: {
    id: 13,
    url: 'https://ansharnet-gateway.radixdlt.com',
    dappDefAddress:
      'account_tdx_d_12x649lyv286g8krpfthv6ne9rw06njn6yp95n303jn5qxq06sznekf'
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

export const VIEW_PORTS = { desktop: 768 }

export const XRDToken = {
  name: XRD_SYMBOL,
  iconUrl: xrdIcon
}

export const EXPECTED_EPOCH_TIME_MINUTES = 5

export const RET_DECIMAL_PRECISION = 18
