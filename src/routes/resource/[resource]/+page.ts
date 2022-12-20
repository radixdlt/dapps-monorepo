import { query } from '@queries'
import type { PageLoad } from './$types'

export const prerender = false

export const load: PageLoad = async ({ params }) => ({
  entityDetailsState: query('getEntityDetails', params.resource, {
    manual: false
  }).state,
  nonFungiblesState: query('getNonFungibleIDs', params.resource, {
    manual: false
  }).state
})
