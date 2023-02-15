import { PUBLIC_NETWORK_NAME } from '$env/static/public'

export const Network = {
  NEBUNET: 'nebunet',
  HAMMUNET: 'hammunet',
  ENKINET: 'enkinet',
  GILGANET: 'gilganet',
  BETANET: 'betanet'
}

export const networkConfig = (
  {
    [Network.NEBUNET]: {
      id: 11,
      url: 'https://nebunet-gateway.radixdlt.com',
      dappDefAddress:
        'account_tdx_b_1prfj0lp3hd2dhjkk2v7apr4vwtrcnn9y67393de7r5gqgpm83a'
    },
    [Network.HAMMUNET]: {
      id: 34,
      url: 'https://hammunet-gateway.radixdlt.com:443',
      dappDefAddress:
        'account_tdx_22_1prtqhxd5mmq2nj3mrhcztxphauy29qeuk5walu49spjsqpjxr6'
    },
    [Network.ENKINET]: {
      id: 33,
      url: 'https://enkinet-gateway.radixdlt.com'
    },
    [Network.GILGANET]: {
      id: 32,
      url: 'https://gilganet-gateway.radixdlt.com'
    },
    [Network.BETANET]: {
      id: 11,
      url: 'https://nebunet-gateway.radixdlt.com',
      dappDefAddress:
        'account_tdx_b_1prfj0lp3hd2dhjkk2v7apr4vwtrcnn9y67393de7r5gqgpm83a'
    }
  } as const
)[
  (PUBLIC_NETWORK_NAME as typeof Network[keyof typeof Network]) ||
    Network.BETANET
]!

console.log(
  `Using network ${PUBLIC_NETWORK_NAME}, with config: ${JSON.stringify(
    networkConfig
  )}`
)
