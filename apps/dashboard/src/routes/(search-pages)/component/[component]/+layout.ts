import { getSingleEntityDetails } from '@api/gateway'
import type { LayoutLoad } from './$types'

export const prerender = false

export const load: LayoutLoad = ({ params }) => {
  const entity = getSingleEntityDetails(params.component)

  return {
    address: params.component,
    promises: {
      entity
    }
  }
}
