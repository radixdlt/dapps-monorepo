import { getSingleEntityDetails } from '@api/gateway'
import type { LayoutLoad } from './$types'
import { getAssociatedDapps } from '../../utils'
import { transformComponent } from '@api/utils/entities/component'

export const load: LayoutLoad = ({ params }) => {
  const entity = getSingleEntityDetails(params.component)

  return {
    address: params.component,
    promises: {
      entity,
      component: entity.then(transformComponent),
      associatedDapps: getAssociatedDapps(entity)
    }
  }
}
