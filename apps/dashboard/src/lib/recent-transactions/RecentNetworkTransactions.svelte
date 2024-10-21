<script lang="ts">
  import { getRecentNetworkTransactions } from '@api/_deprecated/gateway'
  import PaginatedTable from '@components/_base/table/basic-table/PaginatedTable.svelte'
  import { createEventDispatcher, type ComponentProps } from 'svelte'
  import {
    chevronColumnDefinition,
    dateAndTxIdColumnDefinition,
    getFeeColumnDefinition,
    getOtherBalanceChangesColumnDefinition,
    manifestClassColumnDefinition,
    messageColumnDefinition,
    mobileHeaderColumnDefinition,
    recentTransactionsTableConfig
  } from './ColumnDefinition.svelte'
  import { TransactionStatus } from '@common/gateway-sdk'
  import TableRow from '@components/_base/table/basic-table/TableRow.svelte'
  import BasicRow from '@components/_base/table/basic-table/BasicRow.svelte'
  import BasicColumn from '@components/_base/table/basic-table/BasicColumn.svelte'
  import ResponsiveTableCell from '@components/_base/table/basic-table/ResponsiveTableCell.svelte'
  import InfoBar from '@components/info-bar/InfoBar.svelte'

  export let queryFunction = (cursor?: string) =>
    getRecentNetworkTransactions(cursor).unwrapOr({
      items: []
    })

  const feeColumnDefinition = getFeeColumnDefinition()

  const columns: ComponentProps<PaginatedTable<any>>['columns'] = [
    messageColumnDefinition,
    mobileHeaderColumnDefinition,
    dateAndTxIdColumnDefinition,
    manifestClassColumnDefinition,
    feeColumnDefinition,
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
>
  <svelte:fragment slot="row" let:entry>
    {#if entry.transaction_status === TransactionStatus.CommittedFailure}
      <TableRow
        customClass="clickable"
        on:click={(ev) => recentTransactionsTableConfig.onRowClick?.(entry, ev)}
      >
        <BasicColumn {entry} column={messageColumnDefinition} />
        <BasicColumn {entry} column={mobileHeaderColumnDefinition} />
        <BasicColumn {entry} column={dateAndTxIdColumnDefinition} />
        <BasicColumn {entry} column={manifestClassColumnDefinition} />
        <BasicColumn {entry} column={feeColumnDefinition} />
        <ResponsiveTableCell>
          <InfoBar
            type="error"
            message="This transaction has been committed to the ledger as a failure."
          />
        </ResponsiveTableCell>
        <BasicColumn {entry} column={chevronColumnDefinition} />
      </TableRow>
    {:else}
      <BasicRow {columns} config={recentTransactionsTableConfig} {entry} />
    {/if}
  </svelte:fragment>
</PaginatedTable>
