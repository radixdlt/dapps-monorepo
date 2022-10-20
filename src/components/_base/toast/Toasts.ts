import { toast } from '@zerodevx/svelte-toast'
import AToast from './_AlertToast.svelte'

type AlertToastProps = {
  title: string
  text: string
  type: 'success' | 'error' | 'warning' | 'info'
}

export const AlertToast =
  ({ title, text, type }: AlertToastProps) =>
  () =>
    toast.push({
      component: {
        src: AToast,
        props: {
          title,
          text,
          type
        }
      }
    })
