import { RadixNetwork } from '@common/gateway-sdk'
import {
  DEV_SAFE_IMAGE_SERVICE_URL,
  PROD_SAFE_IMAGE_SERVICE_URL
} from '@constants'
import { CURRENT_NETWORK } from '@networks'

const validUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

export const getSafeImageUrl = ({
  url,
  width,
  height
}: {
  url?: string
  width: number
  height: number
}) => {
  if (!url) return { url, valid: false }

  const baseUrl = new URL(
    CURRENT_NETWORK.id === RadixNetwork.Mainnet
      ? PROD_SAFE_IMAGE_SERVICE_URL
      : DEV_SAFE_IMAGE_SERVICE_URL
  )
  const params = new URLSearchParams({
    imageSize: `${width}x${height}`,
    imageOrigin: url
  })
  baseUrl.search = params.toString()
  return { url: baseUrl.toString(), valid: validUrl(url) }
}
