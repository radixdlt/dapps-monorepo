import { getSingleEntityDetails } from '@api/gateway'
import type { PageLoad } from './$types'
import { getAssociatedDapps } from '../../utils'
import { transformResource } from '@api/utils/entities/resource'
import { getPoolUnitData } from '@api/utils/entities/pool-unit'

export const prerender = false

export const load: PageLoad = async ({ params }) => {
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
