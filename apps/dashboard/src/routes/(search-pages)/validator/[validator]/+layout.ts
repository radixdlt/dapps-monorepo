import type { LayoutLoad } from './$types'
import { getAssociatedDapps, getLookupEntity } from '../../utils'
import { transformMetadata } from '@api/_deprecated/utils/metadata'
import { transformValidator } from '@api/utils/entities/component/validator'
import { produceSummary } from '@dashboard/lib/summary/summary'

export const load: LayoutLoad = ({ params }) => {
  const entity = getLookupEntity(params.validator)

  const validator = entity.then(transformValidator)

  const {
    stateVersion,
    stakeInfo,
    poolData,
    fungibleResources,
    nonFungibleResources,
    nfts
  } = produceSummary(validator)

  return {
    address: params.validator,
    promises: {
      entity,
      validator,
      stateVersion,
      stakeInfo,
      poolData,
      fungibleResources,
      nonFungibleResources,
      nfts,
      metadata: entity.then((entity) => transformMetadata(entity, []).all),
      associatedDapps: getAssociatedDapps(entity)
    }
  }
}
