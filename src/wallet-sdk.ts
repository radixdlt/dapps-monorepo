import { AlertToast } from '@components/_base/toast/Toasts'
import { getMethods } from '@radixdlt/connect-button'
import { getTxIdFromMessage } from '@utils'
import { pipe } from 'ramda'
export { configure as configureConnectButton } from '@radixdlt/connect-button'

type ToastOptions = {
  successText?: string
  errorText?: (errorMessage?: string) => string
}

export const getWalletData = () => getMethods().getWalletData

const showSuccessToast = (
  transactionIntentHash: string,
  options?: ToastOptions
) =>
  AlertToast({
    title: 'Transaction successful!',
    text: options?.successText ?? '',
    txId: transactionIntentHash,
    type: 'success'
  })

const showErrorToast = (err: Partial<Error>, options?: ToastOptions) =>
  AlertToast({
    title: 'Transaction failed.',
    text: options?.errorText
      ? options?.errorText(err.message)
      : err.message ?? '',
    txId: err.message ? getTxIdFromMessage(err.message) : undefined,
    type: 'error'
  })

export const sendTransaction = (toastOptions?: ToastOptions) =>
  pipe(getMethods().sendTransaction, (result) =>
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
