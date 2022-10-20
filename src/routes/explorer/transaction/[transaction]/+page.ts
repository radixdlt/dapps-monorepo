import type { PageLoad } from './$types'
import { queryServer } from '@queries'

export const prerender = false

type Action = {
  from: string
  to: string
  amount: number
}

export type Transaction = {
  status: string
  actions: Action[]
}

export const load: PageLoad = async ({ params }) => ({
  tx: await queryServer('getTransactionStatus', params.transaction)
})
