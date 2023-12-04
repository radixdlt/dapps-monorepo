import type { PageLoad } from './$types'
import {
  getAssociatedDapps,
  getLookupEntity,
  getResourcesFromAuth
} from '../../utils'
import { transformResource } from '@api/utils/entities/resource'
import { isNFTAddress } from '@utils'
import { isStakeUnit } from '@api/utils/entities/stake-unit'
import { redirect } from '@sveltejs/kit'
import type { PoolUnit } from '@api/utils/entities/pool-unit'
import { callApi } from '@api/gateway'
import { andThen, pipe } from 'ramda'
import { handleGatewayResult } from '../../../../utils'
import { getStringMetadata } from '@api/utils/metadata'
import type { EntityType } from '@common/ret'
import { http } from '@common/http'

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
  const pool = poolUnit.metadata.standard.pool!.value

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

  if (await isStakeUnit(resource)) {
    throw redirect(308, `/stake_unit/${encodeURIComponent(params.resource)}`)
  }
  const transformedResource = await transformResource(
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
