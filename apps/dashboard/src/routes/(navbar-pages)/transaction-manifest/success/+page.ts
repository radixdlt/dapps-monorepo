import type { PageLoad } from './$types'

export const load: PageLoad = ({ url }) => ({
  txID: url.searchParams.get('txID') as string
})
