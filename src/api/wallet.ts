import { getWalletData } from '../wallet-sdk'
import { sendTransaction as _sendTransaction } from '../wallet-sdk'

export const requestAddresses = async () => {
  const res = await getWalletData()({
    oneTimeAccountsWithoutProofOfOwnership: {}
  })

  if (res.isOk()) return res.value
  throw res.error
}

export const sendTransaction = async (
  transactionManifest: string,
  blobs?: string[],
  toastOptions?: Parameters<typeof _sendTransaction>[0]
) => {
  const res = await _sendTransaction(toastOptions)({
    transactionManifest,
    version: 0,
    blobs
  })
  if (res.isOk()) return res.value
  throw res.error
}
