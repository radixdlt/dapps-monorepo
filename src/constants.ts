import { PUBLIC_NETWORK_NAME } from '$env/static/public'
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
  },
  nebunet: {
    id: Network.Nebunet,
    url: 'https://nebunet-gateway.radixdlt.com'
  }
}[PUBLIC_NETWORK_NAME]

export const dAppId = 'radixdlt.dashboard.com'
