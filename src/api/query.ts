import { writable } from 'svelte/store'
import * as gatewayApi from './gateway'
import * as walletApi from './wallet'
import { getAccountData } from './utils/resources'

const API = {
  ...gatewayApi,
  ...walletApi,
  getAccountData
}

export const query = <
  Fn extends keyof typeof API,
  Input extends Parameters<typeof API[Fn]>
>(
  fn: Fn
) => {
  const loading = writable(false)
  const response = writable<null | Awaited<ReturnType<typeof API[typeof fn]>>>(
    null
  )
  const error = writable<null | Error>(null)

  const send = (...input: Input) => {
    loading.set(true)
    // @ts-ignore
    API[fn](...input)
      .then((res) => {
        loading.set(false)
        // @ts-ignore
        response.set(res)
      })
      .catch((e) => {
        loading.set(false)
        error.set(e)
      })
  }

  return {
    send,
    loading,
    response,
    error
  }
}
