<script lang="ts">
  import TransactionBox from './TransactionBox.svelte'
  import type { Transaction } from '@types'

  const tokenAmount = {
    value: '111',
    token_identifier: {
      rri: 'rri'
    }
  }

  const actions = {
    type: 'TransferTokens',
    from_account: {
      address: 'addressfromaccount'
    },
    to_account: {
      address: 'addresstoaccount'
    },
    amount: tokenAmount,
    metadata: {
      hex: 'hex'
    }
  }

  const transaction = {
    ledger_state: {
      epoch: 33,
      round: 2,
      timestamp: 'timestamp',
      version: 23
    },
    transaction: {
      actions: [actions],
      fee_paid: {},
      metadata: {},
      transaction_identifier: {
        hash: 'hash'
      },
      transaction_status: {
        status: 'CONFIRMED',
        confirmed_time: 'confirmed time',
        ledger_state_version: 33
      }
    }
  } as Transaction
</script>

<TransactionBox tx={transaction} />
