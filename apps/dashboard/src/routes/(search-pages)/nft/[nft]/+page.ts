import { callApi } from '@api/_deprecated/gateway'
import type { PageLoad } from './$types'
import { getLinkedDappDefinitions } from '@api/utils/two-way-linking'
import { getDappDefinitionData, getLookupEntity } from '../../utils'
import { map, pipe } from 'ramda'
import { transformNft } from '@api/utils/nfts'
import { handleGatewayResult } from '../../../../utils'
import { transformNonFungibleResource } from '@api/utils/entities/resource/non-fungible'

export const load: PageLoad = async ({ params, fetch }) => {
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

  const resource = resourceEntity.then(transformNonFungibleResource)

  return {
    nftAddress: params.nft,
    promises: {
      nft: Promise.all([nftData, resourceEntity]).then(
        ([nftData, { address }]) =>
          nftData?.[0] ? transformNft(address, nftData?.[0]) : undefined
      ),
      resource,
      associatedDapps
    }
  }
}
