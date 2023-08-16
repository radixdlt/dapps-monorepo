import { getSingleEntityDetails } from '@api/gateway'
import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'

export const prerender = false

export const load: PageLoad = async ({ params }) => {
  return {
    address: params.resource,
    promises: {
      details: getSingleEntityDetails(params.resource)
    }
  }
}
