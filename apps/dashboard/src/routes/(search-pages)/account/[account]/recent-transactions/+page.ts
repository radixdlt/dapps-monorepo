import type { ManifestClass } from '@radixdlt/babylon-gateway-api-sdk'
import type { PageLoad } from './$types'

export const load: PageLoad = async ({ params, url }) => {
  const withdrawnFrom = url.searchParams.get('withdrawnFrom')?.split(',')
  const depositedTo = url.searchParams.get('depositedTo')?.split(',')
  const badges = url.searchParams.get('badges')?.split(',')
  const resources = url.searchParams.get('resources')?.split(',')
  const affectedEntities = url.searchParams.get('affectedEntities')?.split(',')
  const transactionType = url.searchParams.get('transactionType') as
    | ManifestClass
    | undefined

  return {
    account: params.account,
    filters: {
      withdrawnFrom,
      depositedTo,
      badges,
      resources,
      affectedEntities,
      transactionType
    }
  }
}
