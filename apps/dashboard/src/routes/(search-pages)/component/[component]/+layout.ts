import type { LayoutLoad } from './$types'
import {
  getAssociatedDapps,
  getLookupEntity,
  getResourcesFromAuth
} from '../../utils'
import { transformComponent } from '@api/_deprecated/utils/entities/component'

export const load: LayoutLoad = ({ params }) => {
  const entity = getLookupEntity(params.component)

  const component = entity.then(transformComponent)

  return {
    address: params.component,
    promises: {
      entity,
      component,
      authResources: component.then(({ auth }) => getResourcesFromAuth(auth)),
      associatedDapps: getAssociatedDapps(entity)
    }
  }
}
