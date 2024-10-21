<script lang="ts">
  import {
    dateAndTxIdColumnDefinition,
    manifestClassColumnDefinition,
    messageColumnDefinition,
    mobileHeaderColumnDefinition,
    recentTransactionsTableConfig
  } from './ColumnDefinition.svelte'
  import BalanceChangesColumn from './BalanceChangesColumn.svelte'
  import { getRecentTransactions } from '@api/_deprecated/gateway'
  import PaginatedTable from '@components/_base/table/basic-table/PaginatedTable.svelte'
  import type { ComponentProps } from 'svelte'
  import { fillResourceCacheWithTransactionsData } from '@api/utils/resource-cache-client'
  import {
    createManifestClassProperty,
    createBalanceChanges,
    type StreamTransactionExtension
  } from '@api/helpers/stream-transactions-extensions'
  import BasicRow from '@components/_base/table/basic-table/BasicRow.svelte'
  import {
    TransactionStatus,
    ManifestClass,
    type CommittedTransactionInfo
  } from '@common/gateway-sdk'
  import ResponsiveTableCell from '@components/_base/table/basic-table/ResponsiveTableCell.svelte'
  import TableRow from '@components/_base/table/basic-table/TableRow.svelte'
  import BasicColumn from '@components/_base/table/basic-table/BasicColumn.svelte'
  import InfoBar from '@components/info-bar/InfoBar.svelte'

  export let entityAddress: string
  export let filters: Parameters<typeof getRecentTransactions>[2] = undefined

  let queryFunction: (
    cursor?: string
  ) => ReturnType<typeof createBalanceChanges>

  $: queryFunction = (cursor?: string) =>
    createBalanceChanges(
      entityAddress,
      createManifestClassProperty(
        getRecentTransactions(entityAddress, cursor, filters).then((data) => {
          fillResourceCacheWithTransactionsData(data)
          return data
        })
      )
    )

  const columns: ComponentProps<PaginatedTable<any>>['columns'] = [
    messageColumnDefinition,
    mobileHeaderColumnDefinition,
    dateAndTxIdColumnDefinition,
    manifestClassColumnDefinition,
    {
      id: 'withdrawn',
      header: {
        label: 'Withdrawn'
      },
      component: BalanceChangesColumn,
      componentProps: {
        balanceChanges: '$$withdrawals'
      }
    },
    {
      id: 'deposited',
      header: {
        label: 'Deposited'
      },
      component: BalanceChangesColumn,
      componentProps: {
        balanceChanges: '$$deposits'
      }
    }
  ]

  const isCustomRow = (
    entry: CommittedTransactionInfo & StreamTransactionExtension
  ) =>
    entry.transaction_status === TransactionStatus.CommittedFailure ||
    entry.manifestClass === ManifestClass.AccountDepositSettingsUpdate ||
    (entry.withdrawals.length === 0 && entry.deposits.length === 0)
</script>

<PaginatedTable
  --table-row-cell-vertical-padding="25px"
  config={recentTransactionsTableConfig}
  {columns}
  {queryFunction}
>
  <svelte:fragment slot="row" let:entry>
    {#if isCustomRow(entry)}
      <TableRow
        customClass="clickable"
        on:click={(ev) => recentTransactionsTableConfig.onRowClick?.(entry, ev)}
      >
        <BasicColumn {entry} column={messageColumnDefinition} />
        <BasicColumn {entry} column={mobileHeaderColumnDefinition} />
        <BasicColumn {entry} column={dateAndTxIdColumnDefinition} />
        <BasicColumn {entry} column={manifestClassColumnDefinition} />
        <ResponsiveTableCell colspan={2}>
          {#if entry.manifestClass === ManifestClass.AccountDepositSettingsUpdate}
            <InfoBar
              type="default"
              message="Updated Account Deposit Settings"
            />
          {:else if entry.transaction_status === TransactionStatus.CommittedFailure}
            <InfoBar
              type="error"
              message="This transaction has been committed to the ledger as a failure."
            />
          {:else if !entry.withdrawals.length && !entry.deposits.length}
            <InfoBar
              type="default"
              message="No deposits or withdrawals from this account in this transaction."
            />
          {/if}
        </ResponsiveTableCell>
      </TableRow>
    {:else}
      <BasicRow {columns} config={recentTransactionsTableConfig} {entry} />
    {/if}
  </svelte:fragment>
</PaginatedTable>
