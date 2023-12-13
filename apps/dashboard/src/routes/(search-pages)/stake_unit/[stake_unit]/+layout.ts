import { transformFungibleResource } from '@api/_deprecated/utils/entities/resource.js'
import { resourceToStakeUnit } from '@api/_deprecated/utils/entities/stake-unit.js'
import {
  getAssociatedDapps,
  getLookupEntity,
  getResourcesFromAuth
} from '../../utils.js'

export const load = ({ params }) => {
  const entity = getLookupEntity(params.stake_unit)

  const stakeUnit = entity
    .then(transformFungibleResource)
    .then(resourceToStakeUnit)

  return {
    address: params.stake_unit,
    promises: {
      stakeUnit,
      associatedDapps: getAssociatedDapps(entity),
      authResources: stakeUnit.then(({ auth }) => getResourcesFromAuth(auth))
    }
  }
}
