import type { PageServerLoad } from './$types'
import { transactionStatus } from '@gateway'
import { toWholeUnits } from '@utils'

type Action = {
  from: string
  to: string
  amount: number
}

export type Transaction = {
  status: string
  actions: Action[]
}

export const load: PageServerLoad = async ({ params }) => {
  const response = await transactionStatus(params.transaction)

  const transformedResponse: Transaction = {
    status: response.transaction.transaction_status.status,
    actions: response.transaction.actions.map((action) => ({
      from: action.from_account.address,
      to: action.to_account.address,
      amount: toWholeUnits(action.amount.value)
    }))
  }

  return {
    tx: transformedResponse
  }
}
