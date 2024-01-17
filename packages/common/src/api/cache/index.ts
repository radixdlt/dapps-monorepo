import type { api } from '@common/api/gateway'
import { entityDetailsCache } from './entity-details/entityDetails'

export type Cache<
  ApiCall extends (typeof api)[keyof typeof api],
  Params = Parameters<ApiCall>,
  Response = Awaited<ReturnType<ApiCall>>
> = {
  set: (params: Params, response: Response) => void
  get: (params: Params) => Response
  has: (params: Params) => boolean
  clear: () => void
}

export type ApiCache = {
  [apiCall in keyof typeof api]?: Cache<(typeof api)[apiCall]>
}

export const cache: ApiCache = {
  getEntityDetailsVaultAggregated: entityDetailsCache
}
