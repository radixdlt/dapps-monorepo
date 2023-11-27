import type { TransactionStatus } from '@common/gateway-sdk'
import type { PageLoad } from './$types'

export const prerender = false

export const load: PageLoad = ({ url }) => ({
  txID: url.searchParams.get('txID') as string,
  txStatus: url.searchParams.get('txStatus') as TransactionStatus,
  resourceAddress: url.searchParams.get('resourceAddress') as string
})
