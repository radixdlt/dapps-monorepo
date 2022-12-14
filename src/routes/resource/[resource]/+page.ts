import { query } from '@queries'
import type { PageLoad } from './$types'

export const prerender = false

export const load: PageLoad = async ({ params }) => ({
  state: query('getEntityDetails', params.resource, {
    manual: false
  }).state
})
