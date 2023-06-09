import type { PageLoad } from './$types'

export const prerender = false

export const load: PageLoad = async ({ url }) => ({
  nftAddress: url.toString().split('nft/')[1]!
})
