import { transformNonFungibleResource } from '@api/utils/entities/resource/non-fungible/index.js'
import {
  getAssociatedDapps,
  getLookupEntity,
  getResourcesFromAuth
} from '../../utils.js'
import type { ClaimNftCollection } from '@api/utils/entities/resource/non-fungible/claim-nft-collection.js'

export const load = ({ params }) => {
  const entity = getLookupEntity(params.claim_nft)

  const claimNft = entity.then(async (e) => {
    const claimNft = await transformNonFungibleResource(e)
    claimNft.nonFungibleType = 'claim-nft-collection'
    return claimNft
  }) as Promise<ClaimNftCollection>

  return {
    address: params.claim_nft,
    promises: {
      claimNft,
      associatedDapps: getAssociatedDapps(entity),
      authResources: claimNft.then(({ auth }) => getResourcesFromAuth(auth))
    }
  }
}
