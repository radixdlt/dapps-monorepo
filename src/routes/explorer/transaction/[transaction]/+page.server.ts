import type { PageServerLoad } from './$types'
import { queryServer } from '@queries'

type Action = {
  from: string
  to: string
  amount: number
}

export type Transaction = {
  status: string
  actions: Action[]
}

export const load: PageServerLoad = async ({ params }) => ({
  tx: await queryServer('getTransactionStatus', params.transaction)
})
