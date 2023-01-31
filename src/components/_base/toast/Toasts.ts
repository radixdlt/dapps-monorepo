import { getTxIdFromMessage } from '@utils'
import { toast } from '@zerodevx/svelte-toast'
import AToast from './_AlertToast.svelte'

type AlertToastProps = {
  txId?: string
  title: string
  text: string
  type: 'success' | 'error' | 'warning' | 'info'
}

export type ToastOptions = {
  successText?: string
  errorText?: (errorMessage?: string) => string
}

export const AlertToast = ({ title, text, type, txId }: AlertToastProps) =>
  toast.push({
    component: {
      src: AToast,
      props: {
        txId,
        title,
        text,
        type
      }
    }
  })

export const showSuccessToast = (
  transactionIntentHash: string,
  options?: ToastOptions
) =>
  AlertToast({
    title: 'Transaction successful!',
    text: options?.successText ?? '',
    txId: transactionIntentHash,
    type: 'success'
  })

export const showErrorToast = (err: Partial<Error>, options?: ToastOptions) =>
  AlertToast({
    title: 'Transaction failed.',
    text: options?.errorText
      ? options?.errorText(err.message)
      : err.message ?? '',
    txId: err.message ? getTxIdFromMessage(err.message) : undefined,
    type: 'error'
  })
