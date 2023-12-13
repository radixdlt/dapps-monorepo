import { transformNonFungibleResource } from '@api/_deprecated/utils/entities/resource.js'

import {
  getAssociatedDapps,
  getLookupEntity,
  getResourcesFromAuth
} from '../../utils.js'

export const load = ({ params }) => {
  const entity = getLookupEntity(params.claim_nft)

  const claimNft = entity.then(transformNonFungibleResource)

  return {
    address: params.claim_nft,
    promises: {
      claimNft,
      associatedDapps: getAssociatedDapps(entity),
      authResources: claimNft.then(({ auth }) => getResourcesFromAuth(auth))
    }
  }
}
