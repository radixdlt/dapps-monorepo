import type { PageLoad } from './$types'
import { getRecentTransactions } from '@api/gateway'

export const load: PageLoad = async ({ params }) => {
  return {
    promises: {
      transactionList: getRecentTransactions(params.account)
    }
  }
}
