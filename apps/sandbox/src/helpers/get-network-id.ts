import { RadixNetwork, RadixNetworkConfig } from '@common/gateway-sdk'
import { ENV_NETWORK_NAME } from '../config'

const networkId = RadixNetworkConfig?.[ENV_NETWORK_NAME]?.networkId

export const DEFAULT_NETWORK_ID = networkId
  ? String(networkId)
  : RadixNetwork.Stokenet.toString()

export const getNetworkId = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const networkId = parseInt(
    urlParams.get('networkId') || DEFAULT_NETWORK_ID,
    10
  )
  return networkId
}
