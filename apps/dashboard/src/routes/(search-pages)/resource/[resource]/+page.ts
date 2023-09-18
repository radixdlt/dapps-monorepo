import { getSingleEntityDetails } from '@api/gateway'
import type { PageLoad } from './$types'
import { getAssociatedDapps } from '../../utils'
import { transformResource } from '@api/utils/entities/resource'
import { getPoolUnitData } from '@api/utils/entities/pool-unit'
import { isNFTAddress } from '@utils'
import { isStakeUnit } from '@api/utils/entities/stake-unit'
import { redirect } from '@sveltejs/kit'

export const prerender = false

export const load: PageLoad = async ({ params }) => {
  if (isNFTAddress(params.resource)) {
    throw redirect(308, `/nft/${encodeURIComponent(params.resource)}`)
  }

  if (await isStakeUnit(params.resource)) {
    throw redirect(308, `/stake_unit/${encodeURIComponent(params.resource)}`)
  }

  const resource = getSingleEntityDetails(params.resource)

  const transformedResource = resource.then(transformResource)

  const redeemableTokens = transformedResource.then(async (resource) => {
    if (resource.type === 'poolUnit') {
      return (await getPoolUnitData(resource))?.poolTokens
    }
  })

  return {
    address: params.resource,
    promises: {
      resource: transformedResource,
      associatedDapps: getAssociatedDapps(resource),
      redeemableTokens
    }
  }
}
