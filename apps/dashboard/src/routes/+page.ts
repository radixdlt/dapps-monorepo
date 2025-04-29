import { getRecentNetworkTransactions } from '@api/_deprecated/gateway'
import type { PageLoad } from './$types'
import type { ManifestClass } from '@radixdlt/babylon-gateway-api-sdk'

export const load: PageLoad = async ({ url }) => {
  const withdrawnFrom = url.searchParams.get('withdrawnFrom')?.split(',')
  const depositedTo = url.searchParams.get('depositedTo')?.split(',')
  const transactionStatus = url.searchParams.get('transactionStatus') as
    | 'Success'
    | 'Failure'
    | 'All'
    | undefined
  const badges = url.searchParams.get('badges')?.split(',')
  const resources = url.searchParams.get('resources')?.split(',')
  const affectedEntities = url.searchParams.get('affectedEntities')?.split(',')
  const transactionType = url.searchParams.get('transactionType') as
    | ManifestClass
    | undefined

  const queryFn = (cursor?: string) =>
    getRecentNetworkTransactions(
      { cursor },
      {
        withdrawnFrom,
        depositedTo,
        badges,
        transactionStatus,
        resources,
        affectedEntities,
        transactionType
      }
    ).unwrapOr({
      items: []
    })

  return {
    queryFn,
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
