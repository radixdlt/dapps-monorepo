import { gatewayApi } from '@api/gateway'
import type { LayoutLoad } from './$types'

export const load: LayoutLoad = ({ params }) => {
  const subintent = gatewayApi.transaction.innerClient
    .transactionSubintentStatus({
      transactionSubintentStatusRequest: {
        subintent_hash: params.subintent
      }
    })
    .then((response) => ({
      status: response.subintent_status,
      description: response.subintent_status_description,
      finalizedAt: response.finalized_at_transaction_intent_hash
    }))

  return {
    id: params.subintent,
    subintent
  }
}
