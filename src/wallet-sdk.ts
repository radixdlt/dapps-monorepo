import { AlertToast } from '@components/_base/toast/Toasts'
import { getMethods } from '@radixdlt/connect-button'
import { getTxIdFromMessage } from '@utils'
import { pipe } from 'ramda'
export { configure as configureConnectButton } from '@radixdlt/connect-button'

export const getWalletData = () => getMethods().getWalletData

export const sendTransaction = (toastOptions?: {
  successText?: string
  errorText?: (errorMessage?: string) => string
}) =>
  pipe(getMethods().sendTransaction, (asyncResult) =>
    asyncResult
      .map(({ transactionIntentHash }) => {
        AlertToast({
          title: 'Transaction successful!',
          text: toastOptions?.successText ?? '',
          txId: transactionIntentHash,
          type: 'success'
        })
        return {
          transactionIntentHash
        }
      })
      .mapErr((err) => {
        AlertToast({
          title: 'Transaction failed.',
          text: toastOptions?.errorText
            ? toastOptions?.errorText(err.message)
            : err.message ?? '',
          txId: err.message ? getTxIdFromMessage(err.message) : undefined,
          type: 'error'
        })
        return err
      })
  )
