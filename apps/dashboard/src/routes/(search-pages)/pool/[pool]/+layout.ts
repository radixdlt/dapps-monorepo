import type { LayoutLoad } from './$types'
import {
  getAssociatedDapps,
  getLookupEntity,
  getResourcesFromAuth
} from '../../utils'
import { transformPool } from '@api/utils/entities/component/pool'

export const prerender = false

export const load: LayoutLoad = ({ params }) => {
  const entity = getLookupEntity(params.pool)
  const pool = entity.then(transformPool)

  return {
    address: params.pool,
    promises: {
      entity,
      pool,
      associatedDapps: getAssociatedDapps(entity),
      authResources: pool.then(({ auth }) => getResourcesFromAuth(auth))
    }
  }
}
