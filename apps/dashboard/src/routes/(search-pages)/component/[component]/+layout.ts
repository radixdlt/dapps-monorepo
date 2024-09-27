import type { LayoutLoad } from './$types'
import {
  getAssociatedDapps,
  getLookupEntity,
  getResourcesFromAuth
} from '../../utils'
import { transformComponent } from '@api/utils/entities/component'
import { produceSummary } from '@dashboard/lib/summary/summary'

export const load: LayoutLoad = ({ params }) => {
  const entity = getLookupEntity(params.component)

  const component = entity.then(transformComponent)

  const {
    stateVersion,
    stakeInfo,
    poolData,
    fungibleResources,
    nonFungibleResources,
    nfts
  } = produceSummary(component)

  return {
    address: params.component,
    promises: {
      entity,
      component,
      stateVersion,
      stakeInfo,
      poolData,
      fungibleResources,
      nonFungibleResources,
      nfts,
      authResources: component.then(({ auth }) => getResourcesFromAuth(auth)),
      associatedDapps: getAssociatedDapps(entity)
    }
  }
}
