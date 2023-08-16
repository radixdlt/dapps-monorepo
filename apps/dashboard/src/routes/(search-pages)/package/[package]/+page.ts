import { getSingleEntityDetails } from '@api/gateway'
import type { PageLoad } from './$types'
import { error } from '@sveltejs/kit'

export const prerender = false

export const load: PageLoad = ({ params }) => ({
  address: params.package,
  promises: {
    metadata: getSingleEntityDetails(params.package).then(
      ({ metadata }) => metadata.items
    )
  }
})
