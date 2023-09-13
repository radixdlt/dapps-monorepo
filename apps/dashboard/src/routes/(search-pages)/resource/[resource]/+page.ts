import { getSingleEntityDetails } from '@api/gateway'
import type { PageLoad } from './$types'
import { getAssociatedDapps } from '../../utils'

export const prerender = false

export const load: PageLoad = async ({ params }) => {
  const resource = getSingleEntityDetails(params.resource)

  return {
    address: params.resource,
    promises: {
      resource,
      associatedDapps: getAssociatedDapps(resource)
    }
  }
}
