<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type { PageData } from './$types'
  import Table from '@components/_base/table/Table.svelte'
  import type { TableConfig } from '@components/_base/table/types'
  import DateAndTxIdColumn from './DateAndTxIdColumn.svelte'

  export let data: PageData

  const config: TableConfig = {
    columns: [
      {
        label: 'ID/DATE (GMT +00)',
        property: 'intent_hash_hex',
        component: DateAndTxIdColumn,
        componentProps: {
          id: '$$intent_hash_hex',
          date: '$$confirmed_at'
        }
      },
      {
        label: 'Fee',
        property: 'fee_paid',
        transform: (entry) => `${entry.fee_paid} XRD`
      },
      {
        label: 'Status',
        property: 'transaction_status'
      }
    ]
  }
</script>

{#await data.promises.transactionList}
  <SkeletonLoader />
{:then transactions}
  <Table {config} entries={transactions.items} />
{/await}
