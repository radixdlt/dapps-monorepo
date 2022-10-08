import WalletSdk from '@radixdlt/wallet-sdk'
import { makeQueries } from './_make-queries'

export const request = makeQueries({
  fn: async () => {
    const sdk = WalletSdk()
    const res = await sdk.request({
      accountAddresses: 'any'
    })
    if (res.isOk()) return res.value
    else throw Error(res.error.message)
  },
  decoder: (res) => res,
  transformationFn: (res) => res
})
