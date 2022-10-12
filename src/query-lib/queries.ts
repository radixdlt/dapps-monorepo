import { RequestAddressesIO } from '@io/wallet'
import WalletSdk from '@radixdlt/alphanet-walletextension-sdk'
import { makeQueries } from './_make-queries'

export const requestAddresses = makeQueries({
  fn: async () => {
    const sdk = WalletSdk()
    const res = await sdk.request({
      accountAddresses: 'any'
    })
    if (res.isOk()) return res.value
    else throw Error(res.error.message)
  },
  decoder: (res) => RequestAddressesIO.parse(res),
  transformationFn: (res) => res
})
