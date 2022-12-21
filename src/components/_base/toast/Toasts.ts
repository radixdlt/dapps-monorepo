import { toast } from '@zerodevx/svelte-toast'
import AToast from './_AlertToast.svelte'

type AlertToastProps = {
  txId?: string
  title: string
  text: string
  type: 'success' | 'error' | 'warning' | 'info'
}

export const AlertToast =
  ({ title, text, type, txId }: AlertToastProps) =>
  () =>
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
