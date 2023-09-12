import { getSingleEntityDetails } from '@api/gateway'
import type { PageLoad } from './$types'
import { getLinkedDappDefinitions } from '@api/utils/two-way-linking'
import { map } from 'ramda'
import { getDappDefinitionData } from '../../utils'

export const prerender = false

export const load: PageLoad = async ({ params }) => {
  const resource = getSingleEntityDetails(params.resource)

  const associatedDapps = resource
    .then(getLinkedDappDefinitions)
    .then(map(getDappDefinitionData))

  return {
    address: params.resource,
    promises: {
      resource,
      associatedDapps
    }
  }
}
