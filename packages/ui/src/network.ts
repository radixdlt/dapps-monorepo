import {
  PUBLIC_NETWORK_NAME,
  PUBLIC_DAPP_DEFINITION_ADDRESS
} from '$env/static/public'
import { Network, NETWORK_CONFIG } from '@constants'

const networkConfig =
  NETWORK_CONFIG[PUBLIC_NETWORK_NAME as (typeof Network)[keyof typeof Network]]!

export const CURRENT_NETWORK = PUBLIC_DAPP_DEFINITION_ADDRESS
  ? {
      ...networkConfig,
      consoleDappAddress: PUBLIC_DAPP_DEFINITION_ADDRESS,
      dashboardDappAddress: PUBLIC_DAPP_DEFINITION_ADDRESS
    }
  : networkConfig

console.log(
  `Using network ${PUBLIC_NETWORK_NAME}, with config: ${JSON.stringify(
    CURRENT_NETWORK
  )}`
)
