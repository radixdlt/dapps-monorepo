import { SAFE_IMAGE_SERVICE_URL } from '@constants'

export const getSafeImageUrl = ({
  url,
  width,
  height
}: {
  url: string
  width: number
  height: number
}) => {
  const baseUrl = new URL(SAFE_IMAGE_SERVICE_URL)
  const params = new URLSearchParams({
    imageSize: `${width}x${height}`,
    imageOrigin: url
  })
  baseUrl.search = params.toString()
  return baseUrl.toString()
}
