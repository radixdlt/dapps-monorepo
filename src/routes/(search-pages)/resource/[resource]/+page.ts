import type { PageLoad } from './$types'
import { getEntityDetails } from '@api/gateway'

export const prerender = false

export const load: PageLoad = async ({ params }) => {
  return {
    address: params.resource
  }
}
