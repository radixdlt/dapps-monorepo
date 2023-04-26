import { PUBLIC_NETWORK_NAME } from '$env/static/public'
import { Network, NETWORK_CONFIG } from '@constants'

export const CURRENT_NETWORK =
  NETWORK_CONFIG[PUBLIC_NETWORK_NAME as typeof Network[keyof typeof Network]]!

console.log(
  `Using network ${PUBLIC_NETWORK_NAME}, with config: ${JSON.stringify(
    CURRENT_NETWORK
  )}`
)
