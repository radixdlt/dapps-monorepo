import { routerRedirect } from '../../../router-redirect'
import type { LayoutLoad } from './$types'
import { getLookupEntity } from '../../utils'

export const load: LayoutLoad = ({ params, route }) => {
  routerRedirect(route, `/identity/${params.identity}/metadata`, ['metadata'])

  const entityDetails = getLookupEntity(params.identity)

  return {
    address: params.identity,
    activeTab: route.id.split('/').pop(),
    promises: {
      entityDetails
    }
  }
}
