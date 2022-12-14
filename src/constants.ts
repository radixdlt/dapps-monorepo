import { PUBLIC_NETWORK_NAME } from '$env/static/public'

export const networkConfig = {
  nebunet: {
    id: 11,
    url: 'https://nebunet-gateway.radixdlt.com'
  },
  hammunet: {
    id: 34,
    url: 'https://hammunet-gateway.radixdlt.com:443'
  },
  enkinet: {
    id: 33,
    url: 'https://enkinet-gateway.radixdlt.com'
  },
  gilganet: {
    id: 32,
    url: 'https://gilganet-gateway.radixdlt.com'
  },
  betanet: {
    id: 11,
    url: 'https://nebunet-gateway.radixdlt.com'
  }
}[PUBLIC_NETWORK_NAME]

console.log(`Using network: ${PUBLIC_NETWORK_NAME}`)

export const dAppId = 'radixdlt.dashboard.com'
