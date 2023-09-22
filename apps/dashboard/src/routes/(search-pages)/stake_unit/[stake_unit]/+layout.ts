import { getSingleEntityDetails } from '@api/gateway.js'
import { transformFungibleResource } from '@api/utils/entities/resource.js'
import { resourceToStakeUnit } from '@api/utils/entities/stake-unit.js'
import { getAssociatedDapps } from '../../utils.js'

export const load = ({ params }) => {
  const entity = getSingleEntityDetails(params.stake_unit)

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
