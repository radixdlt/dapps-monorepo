import { sendTransaction as _sendTransaction } from '../radix'

export const sendTransaction = async (
  transactionManifest: string,
  blobs?: string[]
) => {
  const res = await _sendTransaction({
    transactionManifest,
    version: 0,
    blobs
  })
  if (res.isOk()) return res.value
  throw res.error
}
