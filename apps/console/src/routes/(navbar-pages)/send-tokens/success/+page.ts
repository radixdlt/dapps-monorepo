import type { TransactionStatus } from '@common/utils/gateway-sdk'
import type { PageLoad } from './$types'

export const load: PageLoad = ({ url }) => ({
  txID: url.searchParams.get('txID') as string,
  txStatus: url.searchParams.get('txStatus') as TransactionStatus
})
