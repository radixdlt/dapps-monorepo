import { Network } from '@radixdlt/wallet-sdk'

// TODO remove once we don't use the olympia network
export const OLYMPIA_MAINNET_URL = 'https://mainnet-gateway.radixdlt.com'

export const networkConfig = {
  hammunet: {
    id: Network.Hammunet,
    url: 'https://hammunet-gateway.radixdlt.com:443'
  },
  enkinet: {
    id: Network.Enkinet,
    url: 'https://enkinet-gateway.radixdlt.com'
  }
}['hammunet']

export const dAppId = 'radixdlt.dashboard.com'
