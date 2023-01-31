import {
  showErrorToast,
  showSuccessToast,
  type ToastOptions
} from '@components/_base/toast/Toasts'
import type { RadixDappToolkit } from '@radixdlt/radix-dapp-toolkit'
import { andThen, pipe } from 'ramda'

type RDT = ReturnType<typeof RadixDappToolkit>

export let resolveRDT: (rdt: RDT) => void

export const rdt = new Promise<RDT>((resolve) => (resolveRDT = resolve))

export const getWalletData = (data: Parameters<RDT['requestData']>[0]) =>
  pipe(
    () => rdt,
    andThen((rdt) => rdt.requestData(data))
  )()

export const sendTransaction = (
  input: Parameters<RDT['sendTransaction']>[0],
  toastOptions?: ToastOptions
) =>
  pipe(
    () => rdt,
    andThen((rdt) => rdt.sendTransaction(input)),
    andThen((result) =>
      result
        .map(({ transactionIntentHash }) => {
          showSuccessToast(transactionIntentHash, toastOptions)
          return { transactionIntentHash }
        })
        .mapErr((err) => {
          showErrorToast(err, toastOptions)
          return err
        })
    )
  )()
