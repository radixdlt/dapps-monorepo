import { transformFungibleResource } from '@api/utils/entities/resource.js'
import { resourceToStakeUnit } from '@api/utils/entities/stake-unit.js'
import { getAssociatedDapps, getLookupEntity } from '../../utils.js'

export const load = ({ params }) => {
  const entity = getLookupEntity(params.stake_unit)

  return {
    address: params.stake_unit,
    promises: {
      stakeUnit: entity
        .then(transformFungibleResource)
        .then(resourceToStakeUnit),

      associatedDapps: getAssociatedDapps(entity)
    }
  }
}
