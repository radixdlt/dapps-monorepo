import type { LayoutLoad } from './$types'
import {
  getAssociatedDapps,
  getLookupEntity,
  getResourcesFromAuth
} from '../../utils'
import { transformComponent } from '@api/utils/entities/component'

export const prerender = false

export const load: LayoutLoad = ({ params }) => {
  const entity = getLookupEntity(params.pool)
  const pool = entity.then(transformComponent)

  return {
    address: params.pool,
    promises: {
      entity,
      pool: entity.then(transformComponent),
      associatedDapps: getAssociatedDapps(entity),
      authResources: pool.then(({ auth }) => getResourcesFromAuth(auth))
    }
  }
}
