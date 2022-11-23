import { Network } from '@radixdlt/wallet-sdk'

// TODO remove once we don't use the olympia network
export const OLYMPIA_MAINNET_URL = 'https://mainnet-gateway.radixdlt.com'

export const networkConfig = {
  id: Network.Hammunet,
  url: 'https://hammunet-gateway.radixdlt.com:443'
}
export const dAppId = 'radixdlt.dashboard.com'
