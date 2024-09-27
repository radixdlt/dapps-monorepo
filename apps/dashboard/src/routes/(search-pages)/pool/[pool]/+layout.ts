import type { LayoutLoad } from './$types'
import {
  getAssociatedDapps,
  getLookupEntity,
  getResourcesFromAuth
} from '../../utils'
import { transformPool } from '@api/utils/entities/component/pool'
import { produceSummary } from '@dashboard/lib/summary/summary'

export const prerender = false

export const load: LayoutLoad = ({ params }) => {
  const entity = getLookupEntity(params.pool)
  const pool = entity.then(transformPool)

  const {
    stateVersion,
    stakeInfo,
    poolData,
    fungibleResources,
    nonFungibleResources,
    nfts
  } = produceSummary(pool)

  return {
    address: params.pool,
    promises: {
      entity,
      pool,
      stateVersion,
      stakeInfo,
      poolData,
      fungibleResources,
      nonFungibleResources,
      nfts,
      associatedDapps: getAssociatedDapps(entity),
      authResources: pool.then(({ auth }) => getResourcesFromAuth(auth))
    }
  }
}
