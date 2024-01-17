import { SAFE_IMAGE_SERVICE_URL } from './constants'

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

  const baseUrl = new URL(SAFE_IMAGE_SERVICE_URL)
  const params = new URLSearchParams({
    imageSize: `${width}x${height}`,
    imageOrigin: url
  })
  baseUrl.search = params.toString()
  return { url: baseUrl.toString(), valid: validUrl(url) }
}
