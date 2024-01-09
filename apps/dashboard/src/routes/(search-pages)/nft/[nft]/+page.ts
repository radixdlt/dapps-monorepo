import { callApi } from '@api/_deprecated/gateway'
import type { PageLoad } from './$types'
import { getLinkedDappDefinitions } from '@api/utils/two-way-linking'
import {
  getDappDefinitionData,
  getLookupEntity,
  getResourcesFromAuth
} from '../../utils'
import { map, pipe } from 'ramda'
import { transformNft } from '@api/utils/nfts'
import { handleGatewayResult } from '../../../../utils'
import { transformNonFungibleResource } from '@api/utils/entities/resource/non-fungible'
import { errorPage } from '@dashboard/stores'

export const load: PageLoad = async ({ params }) => {
  const [resourceAddress, nftId] = decodeURIComponent(params.nft).split(':')

  const resourceEntity = getLookupEntity(resourceAddress, {
    explicitMetadata: ['name', 'tags']
  })

  const nftData = pipe(
    () => callApi('getNonFungibleData', resourceAddress, [nftId]),
    handleGatewayResult()
  )()

  nftData.then((data) => {
    if (data.length === 0) {
      errorPage.set({
        message: 'NFT not found'
      })
    }
  })

  const associatedDapps = resourceEntity
    .then(getLinkedDappDefinitions)
    .then(map(getDappDefinitionData))

  const resource = resourceEntity.then(transformNonFungibleResource)

  return {
    nftAddress: params.nft,
    promises: {
      nft: Promise.all([nftData, resourceEntity]).then(
        ([nftData, { address }]) => transformNft(address, nftData[0])
      ),
      resource,
      associatedDapps,
      authResources: resource.then(({ auth }) => getResourcesFromAuth(auth))
    }
  }
}
