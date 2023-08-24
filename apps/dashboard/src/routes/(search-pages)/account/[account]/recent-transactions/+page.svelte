<script lang="ts">
  import type { LayoutData } from './$types'
  import DateAndTxIdColumn from './DateAndTxIdColumn.svelte'
  import { getRecentTransactions } from '@api/gateway'
  import PaginatedTable from '@components/_base/table/basic-table/PaginatedTable.svelte'
  import type { ComponentProps } from 'svelte'
  import { context } from '../+layout.svelte'

  export let data: LayoutData

  const activeTab = context.get('activeTab')
  $activeTab = 'recent-transactions'

  const queryFunction = (cursor?: string) =>
    getRecentTransactions(data.account, cursor)

  const columns: ComponentProps<PaginatedTable<any>>['columns'] = [
    {
      header: {
        label: 'ID/DATE (GMT +00)'
      },
      component: DateAndTxIdColumn,
      componentProps: {
        id: '$$intent_hash_hex',
        date: '$$confirmed_at'
      }
    },
    {
      header: {
        label: 'Fee'
      },
      renderAs: (entry: any) => `${entry.fee_paid} XRD`
    },
    {
      header: {
        label: 'Status'
      },
      renderAs: (entry: any) => entry.transaction_status
    }
  ]
</script>

<PaginatedTable {columns} {queryFunction} />
