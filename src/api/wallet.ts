import { getWalletData } from '../radix'
import { sendTransaction as _sendTransaction } from '../radix'

export const requestAddresses = async () => {
  const res = await getWalletData({
    accounts: {
      quantifier: 'atLeast',
      quantity: 1,
      reset: false,
      oneTime: false
    }
  })
  if (res.isOk()) return res.value
  throw res.error
}

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
