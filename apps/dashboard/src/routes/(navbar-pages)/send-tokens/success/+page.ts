import type { TransactionStatus } from '@radixdlt/babylon-gateway-api-sdk'
import type { PageLoad } from './$types'

export const load: PageLoad = ({ url }) => ({
  txID: url.searchParams.get('txID') as string,
  txStatus: url.searchParams.get('txStatus') as TransactionStatus
})
