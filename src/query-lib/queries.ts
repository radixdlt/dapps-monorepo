import WalletSdk from '@radixdlt/wallet-sdk'
import { TransactionLibrary } from '../utils/transaction-library'
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
  decoder: (res) => res,
  transformationFn: (res) => res
})

export const createTransactionService = makeQueries({
  fn: async () => fetch('./src/transaction_library.wasm'),
  decoder: (res) => res,
  transformationFn: async (res) => {
    const blob: ArrayBuffer = await res.arrayBuffer()
    return TransactionLibrary.fromWasmModuleBuffer(Buffer.from(blob))
  }
})
