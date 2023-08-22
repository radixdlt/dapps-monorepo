import { getAccountData } from '@api/utils/resources'
import type { LayoutLoad } from './$types'

export const prerender = false

export const load: LayoutLoad = ({ params }) => {
  const accountData = getAccountData([params.account], {
    explicitMetadata: ['name', 'tags', 'icon_url']
  }).then((data) => data[0])

  return {
    address: params.account,
    promises: {
      accountData
    }
  }
}
