import { transformNonFungibleResource } from '@api/utils/entities/resource/non-fungible/index.js'
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
