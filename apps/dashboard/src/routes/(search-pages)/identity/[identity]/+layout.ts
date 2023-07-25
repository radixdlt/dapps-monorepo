import { routerRedirect } from '../../../router-redirect'
import type { LayoutLoad } from './$types'
import { getSingleEntityDetails } from '@api/gateway'

export const prerender = false

export const load: LayoutLoad = ({ params, route }) => {
  routerRedirect(route, `/identity/${params.identity}/metadata`, ['metadata'])

  const entityDetails = getSingleEntityDetails(params.identity)
  return {
    address: params.identity,
    activeTab: route.id.split('/').pop(),
    promises: {
      entityDetails
    }
  }
}
