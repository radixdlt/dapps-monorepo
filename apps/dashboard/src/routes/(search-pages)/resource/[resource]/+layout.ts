import type { LayoutLoad } from './$types'
import {
  getAssociatedDapps,
  getLookupEntity,
  getResourcesFromAuth
} from '../../utils'
import { isNFTAddress } from '@utils'
import { redirect } from '@sveltejs/kit'
import { callApi } from '@api/_deprecated/gateway'
import { andThen, pipe } from 'ramda'
import { handleGatewayResult } from '../../../../utils'
import { getStringMetadata } from '@api/utils/metadata'
import { verifyStakeUnit } from '@api/utils/entities/resource/fungible/stake-unit'
import { verifyClaimNft } from '@api/utils/entities/resource/non-fungible/claim-nft-collection'
import { transformUnknownResource } from '@api/utils/entities/resource'
import type { PoolUnit } from '@api/utils/entities/resource/fungible/pool-unit'

const getRedeemableTokens = async (poolUnit: PoolUnit) => {
  const pool = poolUnit.metadata.expected.pool!.typed.value

  const poolEntity = await pipe(
    () =>
      callApi('getEntityDetailsVaultAggregated', [pool], {
        explicitMetadata: ['icon_url', 'name']
      }),
    handleGatewayResult(),
    andThen((entities) => entities[0])
  )()

  return poolEntity.fungible_resources.items.map((item) => ({
    iconUrl: getStringMetadata('icon_url')(item.explicit_metadata!),
    name: getStringMetadata('name')(item.explicit_metadata!)
  }))
}

export const load: LayoutLoad = async ({ params }) => {
  if (isNFTAddress(params.resource)) {
    throw redirect(308, `/nft/${encodeURIComponent(params.resource)}`)
  }

  const resource = await getLookupEntity(params.resource)

  const isValidStakeUnit = verifyStakeUnit(resource)
  const isValidClaimNft = verifyClaimNft(resource)

  if (isValidStakeUnit) {
    throw redirect(308, `/stake_unit/${encodeURIComponent(params.resource)}`)
  } else if (isValidClaimNft) {
    throw redirect(308, `/claim_nft/${encodeURIComponent(params.resource)}`)
  }
  const transformedResource = transformUnknownResource(resource)

  const redeemableTokens =
    transformedResource.type === 'poolUnit'
      ? getRedeemableTokens(transformedResource)
      : Promise.resolve(undefined)

  return {
    address: params.resource,
    resource: transformedResource,
    promises: {
      associatedDapps: getAssociatedDapps(Promise.resolve(resource)),
      redeemableTokens,
      authResources: getResourcesFromAuth(transformedResource.auth)
    }
  }
}
