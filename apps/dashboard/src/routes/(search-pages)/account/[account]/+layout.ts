import { routerRedirect } from '../../../router-redirect'
import type { LayoutLoad } from './$types'
import { getSingleEntityDetails } from '@api/gateway'

export const prerender = false

export const load: LayoutLoad = ({ params, route }) => {
  routerRedirect(route, `/account/${params.account}/tokens`, [
    'tokens',
    'nfts',
    'metadata',
    'recent-transactions'
  ])

  return {
    address: params.account,
    activeTab: route.id.split('/').pop(),
    promises: {
      entityDetails: getSingleEntityDetails(params.account)
    }
  }
}
