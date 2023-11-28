<script lang="ts">
  import {
    chevronColumnDefinition,
    dateAndTxIdColumnDefinition,
    getFeeColumnDefinition,
    getOtherBalanceChangesColumnDefinition,
    messageColumnDefinition,
    mobileHeaderColumnDefinition,
    recentTransactionsTableConfig
  } from './ColumnDefinition.svelte'
  import BalanceChangesColumn from './BalanceChangesColumn.svelte'
  import ExportCsvButton from '@dashboard-pages/search-pages/export-csv-button/ExportCsvButton.svelte'
  import { getRecentTransactions } from '@api/_deprecated/gateway'
  import PaginatedTable from '@components/_base/table/basic-table/PaginatedTable.svelte'
  import type { ComponentProps } from 'svelte'
  import { queryAndCacheUniqueResources } from '@api/utils/resource-cache-client'
  import BasicRow from '@components/_base/table/basic-table/BasicRow.svelte'
  import { TransactionStatus } from '@common/gateway-sdk'
  import ResponsiveTableCell from '@components/_base/table/basic-table/ResponsiveTableCell.svelte'
  import TableRow from '@components/_base/table/basic-table/TableRow.svelte'
  import BasicColumn from '@components/_base/table/basic-table/BasicColumn.svelte'
  import CommittedFailureColumn from './CommittedFailureColumn.svelte'

  export let entityAddress: string

  const queryFunction = (cursor?: string) =>
    queryAndCacheUniqueResources(getRecentTransactions(entityAddress, cursor))

  const feeColumnDefinition = getFeeColumnDefinition({ alignment: 'right' })

  const columns: ComponentProps<PaginatedTable<any>>['columns'] = [
    messageColumnDefinition,
    mobileHeaderColumnDefinition,
    dateAndTxIdColumnDefinition,
    feeColumnDefinition,
    getOtherBalanceChangesColumnDefinition({ entityAddress }),
    {
      id: 'balance-increases',
      header: {
        label: 'Balance Increases'
      },
      width: '190px',
      alignment: 'right',
      component: BalanceChangesColumn,
      componentProps: {
        entityAddress,
        type: 'increases',
        balanceChanges: '$$balance_changes'
      }
    },
    {
      id: 'balance-decreases',
      header: {
        label: 'Balance Decreases'
      },
      width: '190px',
      alignment: 'right',
      component: BalanceChangesColumn,
      componentProps: {
        entityAddress,
        type: 'decreases',
        balanceChanges: '$$balance_changes'
      }
    },
    chevronColumnDefinition
  ]
</script>

<div class="export-button">
  <ExportCsvButton {entityAddress} />
</div>

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
        <BasicColumn {entry} column={feeColumnDefinition} />
        <ResponsiveTableCell colspan={3}>
          <CommittedFailureColumn />
        </ResponsiveTableCell>
        <BasicColumn {entry} column={chevronColumnDefinition} />
      </TableRow>
    {:else}
      <BasicRow {columns} config={recentTransactionsTableConfig} {entry} />
    {/if}
  </svelte:fragment>
</PaginatedTable>

<style lang="scss">
  .export-button {
    text-align: right;
    margin-bottom: var(--spacing-xl);

    @include mixins.minWidthMedia(820px) {
      transform: translateY(-1rem);
      position: absolute;
      right: 0;
      transform: none;
      top: 90px;
    }
  }
</style>
