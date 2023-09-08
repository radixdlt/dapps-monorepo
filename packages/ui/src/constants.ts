import xrdIcon from '@icons/xrd-token-icon.svg'

export const Network = {
  HAMMUNET: 'hammunet',
  ENKINET: 'enkinet',
  GILGANET: 'gilganet',
  MARDUNET: 'mardunet',
  ANSHARNET: 'ansharnet',
  ZABANET: 'zabanet',
  STOKENET: 'stokenet',
  RCNETV3: 'rcnet-v3',
  RCNETV2: 'rcnet-v2'
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
  [Network.MARDUNET]: {
    id: 36,
    url: 'https://mardunet-gateway.radixdlt.com',
    dappDefAddress: 'account_tdx_24_thisdummyvalue12345'
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
      'account_tdx_e_16xygyhqp3x3awxlz3c5dzrm7jqghgpgs776v4af0yfr7xljqmna3ha'
  },
  [Network.RCNETV3]: {
    id: 14,
    url: 'https://rcnet-v3.radixdlt.com',
    dappDefAddress:
      'account_tdx_e_16xygyhqp3x3awxlz3c5dzrm7jqghgpgs776v4af0yfr7xljqmna3ha'
  },
  [Network.RCNETV2]: {
    id: 13,
    url: 'https://ansharnet-gateway.radixdlt.com',
    dappDefAddress:
      'account_tdx_d_12x649lyv286g8krpfthv6ne9rw06njn6yp95n303jn5qxq06sznekf'
  },
  [Network.STOKENET]: {
    id: 2,
    url: 'https://babylon-stokenet-gateway.radixdlt.com',
    dappDefAddress:
      'account_tdx_2_12y0yfxerx3jhl20csxlz3nu8hamm5yyluxwvquv9uqrzzfj7y2kp0c'
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
