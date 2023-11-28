import { callApi } from '@api/_deprecated/gateway'
import type { PageLoad } from './$types'
import { transformNonFungibleResource } from '@api/_deprecated/utils/entities/resource'
import { getLinkedDappDefinitions } from '@api/_deprecated/utils/two-way-linking'
import {
  getDappDefinitionData,
  getLookupEntity,
  getResourcesFromAuth
} from '../../utils'
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

  const resource = resourceEntity.then(transformNonFungibleResource)

  return {
    nftAddress: params.nft,
    promises: {
      nftData: Promise.all([nftData, resourceEntity]).then(
        ([nftData, { address }]) => transformNft(address, nftData[0])
      ),
      resource,
      associatedDapps,
      authResources: resource.then(({ auth }) => getResourcesFromAuth(auth))
    }
  }
}
