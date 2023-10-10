import type { TransactionStatus } from '@common/gateway-sdk'
import type { PageLoad } from './$types'

export const prerender = false

export const load: PageLoad = ({ url }) => ({
  txID: url.searchParams.get('txID') as string,
  txStatus: url.searchParams.get('txStatus') as TransactionStatus,
  packageAddress: url.searchParams.get('packageAddress') as string,
  badgeInfo: {
    name: url.searchParams.get('badgeName') as string,
    address: url.searchParams.get('badgeAddress') as string,
    id: decodeURIComponent(url.searchParams.get('badgeId') || '') as string
  }
})
