<script lang="ts">
  import { getRecentNetworkTransactions } from '@api/gateway'
  import PaginatedTable from '@components/_base/table/basic-table/PaginatedTable.svelte'
  import type { ComponentProps } from 'svelte'
  import {
    chevronColumnDefinition,
    dateAndTxIdColumnDefinition,
    getFeeColumnDefinition,
    getOtherBalanceChangesColumnDefinition,
    messageColumnDefinition,
    mobileHeaderColumnDefinition,
    recentTransactionsTableConfig
  } from './ColumnDefinition.svelte'

  const queryFunction = (cursor?: string) => {
    return getRecentNetworkTransactions(cursor).unwrapOr({
      items: []
    })
  }

  const columns: ComponentProps<PaginatedTable<any>>['columns'] = [
    messageColumnDefinition,
    mobileHeaderColumnDefinition,
    dateAndTxIdColumnDefinition,
    getFeeColumnDefinition(),
    getOtherBalanceChangesColumnDefinition({
      label: 'Balance Changes'
    }),
    chevronColumnDefinition
  ]
</script>

<PaginatedTable
  --table-row-cell-vertical-padding="25px"
  config={recentTransactionsTableConfig}
  {columns}
  {queryFunction}
/>
