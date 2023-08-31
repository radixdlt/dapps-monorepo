import { getNonFungibleData, getSingleEntityDetails } from '@api/gateway'
import type { PageLoad } from './$types'
import {
  transformNft,
  transformNonFungibleResource
} from '@api/utils/resources'
import { getLinkedDappDefinitions } from '@api/utils/two-way-linking'
import { getStringMetadata } from '@api/utils/metadata'

export const prerender = false

export const load: PageLoad = async ({ params }) => {
  const [resourceAddress, nftId] = decodeURIComponent(params.nft).split(':')

  const nftData = getNonFungibleData(resourceAddress, [nftId])

  const resourceEntity = getSingleEntityDetails(resourceAddress, {
    explicitMetadata: ['name', 'tags']
  })

  const associatedDapps = resourceEntity
    .then(getLinkedDappDefinitions)
    .then((entities) =>
      entities.map(({ metadata }) => ({
        name: getStringMetadata('name')(metadata),
        iconUrl: getStringMetadata('icon_url')(metadata)
      }))
    )

  return {
    nftAddress: params.nft,
    promises: {
      nftData: Promise.all([nftData, resourceEntity]).then(
        ([nftData, { address }]) => transformNft(address, nftData[0])
      ),
      resource: resourceEntity.then(transformNonFungibleResource),
      associatedDapps
    }
  }
}
