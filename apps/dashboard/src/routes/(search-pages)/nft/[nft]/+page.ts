import { callApi } from '@api/gateway'
import type { PageLoad } from './$types'
import { transformNonFungibleResource } from '@api/utils/entities/resource'
import { getLinkedDappDefinitions } from '@api/utils/two-way-linking'
import { getDappDefinitionData, getLookupEntity } from '../../utils'
import { map, pipe } from 'ramda'
import { transformNft } from '@api/utils/nfts'
import { handleGatewayResult } from '../../../../utils'

export const load: PageLoad = async ({ params }) => {
  const [resourceAddress, nftId] = decodeURIComponent(params.nft).split(':')

  const resourceEntity = getLookupEntity(resourceAddress, {
    explicitMetadata: ['name', 'tags']
  })

  const nftData = pipe(
    () => callApi('getNonFungibleData', resourceAddress, [nftId]),
    handleGatewayResult()
  )()

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
