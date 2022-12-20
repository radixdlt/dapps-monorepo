import { query } from '@queries'
import type { PageLoad } from './$types'

export const prerender = false

export const load: PageLoad = async ({ params }) => ({
  state: query('getNonFungibleData', {
    address: params.nft.split(':')[0],
    id: params.nft.split(':')[1]
  }).state,
  nftAddress: params.nft
})
