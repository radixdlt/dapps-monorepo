<script lang="ts">
  type Transaction = {
    ledger_state: {
      epoch: number
      round: number
      timestamp: string
      version: number
    }
    transaction: {
      actions: []
      fee_paid: {}
      metadata: {}
      transaction_identifier: {
        hash: string
      }
      transaction_status: {
        status: "CONFIRMED" | "REJECTED" | "PENDING"
        confirmed_time: string
        ledger_state_version: number
      }
    }
  }

  export let tx: Transaction
</script>

{JSON.stringify(tx.transaction)}
