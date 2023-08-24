import { getNonFungibleData, getSingleEntityDetails } from '@api/gateway'
import type { PageLoad } from './$types'

export const prerender = false

export const load: PageLoad = async ({ params }) => {
  const [resourceAddress = '', nftId = ''] = params.nft.includes(':')
    ? params.nft.split(':')
    : [params.nft, '']

  const nftData = getNonFungibleData(resourceAddress, [nftId]).catch(() => [
    { non_fungible_id: '' }
  ])

  const details = getSingleEntityDetails(resourceAddress)

  return {
    nftAddress: params.nft,
    promises: {
      nftData,
      details
    }
  }
}
