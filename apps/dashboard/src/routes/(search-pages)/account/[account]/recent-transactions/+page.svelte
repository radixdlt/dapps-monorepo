<script lang="ts">
  import type { PageData } from './$types'
  import PaginatedTable from '@components/_base/table/PaginatedTable.svelte'
  import type { TableConfig } from '@components/_base/table/types'
  import DateAndTxIdColumn from './DateAndTxIdColumn.svelte'
  import { getRecentTransactions } from '@api/gateway'

  export let data: PageData

  const queryFunction = (cursor?: string) =>
    getRecentTransactions(data.account, cursor)

  const config: TableConfig<any> = {
    columns: [
      {
        label: 'ID/DATE (GMT +00)',
        component: DateAndTxIdColumn,
        componentProps: {
          id: '$$intent_hash_hex',
          date: '$$confirmed_at'
        }
      },
      {
        label: 'Fee',
        renderAs: (entry: any) => `${entry.fee_paid} XRD`
      },
      {
        label: 'Status',
        renderAs: (entry: any) => entry.transaction_status
      }
    ]
  }
</script>

<PaginatedTable {config} {queryFunction} />
