import type { api } from '@api/gateway'
import type { Cache } from '..'
import type { StateEntityDetailsVaultResponseItem } from '@common/gateway-sdk'

const storage = new Map<string, StateEntityDetailsVaultResponseItem>()

const key =
  (params: Parameters<(typeof api)['getEntityDetailsVaultAggregated']>) =>
  (address: string) =>
    `${address}${params[1] ? JSON.stringify(params[1]) : ''}${
      params[2] ? JSON.stringify(params[2]) : ''
    }`

export const entityDetailsCache: Cache<
  (typeof api)['getEntityDetailsVaultAggregated']
> = {
  set: (params, response) => {
    params[0].forEach((address) => {
      const item = response.find((item) => item.address === address)
      if (item) {
        storage.set(key(params)(address), item)
      }
    })
  },

  get: (params) =>
    Array.from(storage.entries())
      .filter(([_key, _]) => params[0].map(key(params)).includes(_key))
      .map(([_, value]) => value),

  has: (params) =>
    params[0]
      .map(key(params))
      .map((key) => storage.has(key))
      .every((has) => has),

  clear: () => storage.clear()
}
