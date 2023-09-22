import { getSingleEntityDetails } from '@api/gateway'
import type { LayoutLoad } from './$types'
import { getAssociatedDapps } from '../../utils'
import { transformComponent } from '@api/utils/entities/component'

export const prerender = false

export const load: LayoutLoad = ({ params }) => {
  const entity = getSingleEntityDetails(params.pool)

  return {
    address: params.pool,
    promises: {
      entity,
      pool: entity.then(transformComponent),
      associatedDapps: getAssociatedDapps(entity)
    }
  }
}
