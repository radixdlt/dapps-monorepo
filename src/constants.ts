import { Network as NetworkId } from '@radixdlt/wallet-sdk'

// TODO remove once we don't use the olympia network
export const OLYMPIA_MAINNET_URL = 'https://mainnet-gateway.radixdlt.com'

const networkConfig = {
  hammunet: {
    id: NetworkId.Hammunet,
    url: 'https://hammunet-gateway.radixdlt.com:443'
  },
  enkinet: {
    id: NetworkId.Enkinet,
    url: 'https://enkinet-gateway.radixdlt.com'
  }
}

type Network = keyof typeof networkConfig

let network: Network = 'hammunet'

const isSupportedNetwork = (_network: unknown): _network is Network =>
  Object.keys(networkConfig).some((network) => network === _network)

export const getNetworkConfig = () => networkConfig[network]

export const setNetworkConfig = (_network: unknown) => {
  if (isSupportedNetwork(_network)) {
    network = _network
  } else {
    alert(`Network ${_network} is not supported.`)
  }
}

export const dAppId = 'radixdlt.dashboard.com'
