import type { PageLoad } from './$types'
import {
  getAssociatedDapps,
  getLookupEntity,
  getResourcesFromAuth
} from '../../utils'
import { isNFTAddress } from '@common/utils/formatting'
import { redirect } from '@sveltejs/kit'
import { callApi } from '@common/api/_deprecated/gateway'
import { andThen, pipe } from 'ramda'
import { handleGatewayResult } from '../../../../utils'
import { getStringMetadata } from '@common/api/utils/metadata'
import type { EntityType } from '@common/utils/ret'
import { http } from '@common/utils/http'
import { hasValidatorMetadataSet } from '@common/api/utils/entities/component/validator'
import { verifyStakeUnit } from '@common/api/utils/entities/resource/fungible/stake-unit'
import { verifyClaimNft } from '@common/api/utils/entities/resource/non-fungible/claim-nft-collection'
import { transformUnknownResource } from '@common/api/utils/entities/resource'
import type { PoolUnit } from '@common/api/utils/entities/resource/fungible/pool-unit'

const ERROR_MSG = 'Failed to load resource data.'

const getEntityTypes = async (
  addresses: string[]
): Promise<{ [address: string]: EntityType }> =>
  http.post('/api/ret/entity-type', {
    addresses
  })

const getEntityDetails = (stateVersion?: number) => (addresses: string[]) =>
  pipe(
    () =>
      callApi(
        'getEntityDetailsVaultAggregated',
        addresses,
        undefined,
        stateVersion
          ? {
              state_version: stateVersion
            }
          : undefined
      ),
    handleGatewayResult((_) => ERROR_MSG)
  )()

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

export const load: PageLoad = async ({ params }) => {
  if (isNFTAddress(params.resource)) {
    throw redirect(308, `/nft/${encodeURIComponent(params.resource)}`)
  }

  const resource = await getLookupEntity(params.resource)

  const isValidStakeUnit = await verifyStakeUnit(resource)
  const isValidClaimNft = await verifyClaimNft(resource)

  if (hasValidatorMetadataSet(resource)) {
    if (isValidStakeUnit) {
      throw redirect(308, `/stake_unit/${encodeURIComponent(params.resource)}`)
    } else if (isValidClaimNft) {
      throw redirect(308, `/claim_nft/${encodeURIComponent(params.resource)}`)
    }
  }
  const transformedResource = await transformUnknownResource(
    resource,
    getEntityTypes,
    getEntityDetails()
  )

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
