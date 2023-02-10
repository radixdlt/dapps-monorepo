import { PUBLIC_NETWORK_NAME } from '$env/static/public'

export const Network = {
  NEBUNET: 'nebunet',
  HAMMUNET: 'hammunet',
  ENKINET: 'enkinet',
  GILGANET: 'gilganet',
  BETANET: 'betanet'
}

export const networkConfig = {
  [Network.NEBUNET]: {
    id: 11,
    url: 'https://nebunet-gateway.radixdlt.com'
  },
  [Network.HAMMUNET]: {
    id: 34,
    url: 'https://hammunet-gateway.radixdlt.com:443'
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
    url: 'https://nebunet-gateway.radixdlt.com'
  }
}[PUBLIC_NETWORK_NAME]

console.log(`Using network: ${PUBLIC_NETWORK_NAME}`)

export const dAppId = 'radixdlt.dashboard.com'
