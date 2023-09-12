import { getNonFungibleData, getSingleEntityDetails } from '@api/gateway'
import type { PageLoad } from './$types'
import {
  transformNft,
  transformNonFungibleResource
} from '@api/utils/entities/resource'
import { getLinkedDappDefinitions } from '@api/utils/two-way-linking'
import { getDappDefinitionData } from '../../utils'
import { map } from 'ramda'

export const prerender = false

export const load: PageLoad = async ({ params }) => {
  const [resourceAddress, nftId] = decodeURIComponent(params.nft).split(':')

  const nftData = getNonFungibleData(resourceAddress, [nftId])

  const resourceEntity = getSingleEntityDetails(resourceAddress, {
    explicitMetadata: ['name', 'tags']
  })

  const associatedDapps = resourceEntity
    .then(getLinkedDappDefinitions)
    .then(map(getDappDefinitionData))

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
