import { getWalletData } from '../radix'
import { sendTransaction as _sendTransaction } from '../radix'

export const requestAddresses = async () => {
  const res = await getWalletData({
    accounts: {
      quantifier: 'atLeast',
      quantity: 1
    }
  })
  if (res.isOk()) return res.value
  throw res.error
}

export const sendTransaction = async (
  transactionManifest: string,
  blobs?: string[],
  toastOptions?: Parameters<typeof _sendTransaction>[1]
) => {
  const res = await _sendTransaction(
    {
      transactionManifest,
      version: 0,
      blobs
    },
    toastOptions
  )
  if (res.isOk()) return res.value
  throw res.error
}
