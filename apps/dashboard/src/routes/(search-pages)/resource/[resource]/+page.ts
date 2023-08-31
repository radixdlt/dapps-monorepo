import { getSingleEntityDetails } from '@api/gateway'
import type { PageLoad } from './$types'
import { getLinkedDappDefinitions } from '@api/utils/two-way-linking'
import { getStringMetadata } from '@api/utils/metadata'

export const prerender = false

export const load: PageLoad = async ({ params }) => {
  const resource = getSingleEntityDetails(params.resource)

  const associatedDapps = resource
    .then(getLinkedDappDefinitions)
    .then((entities) =>
      entities.map(({ metadata }) => ({
        name: getStringMetadata('name')(metadata),
        iconUrl: getStringMetadata('icon_url')(metadata)
      }))
    )

  return {
    address: params.resource,
    promises: {
      resource,
      associatedDapps
    }
  }
}
