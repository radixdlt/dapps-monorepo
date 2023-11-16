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
  import type { NftGlobalId } from '@api/utils/entities/resource'
  import BalanceChangesColumn from './BalanceChangesColumn.svelte'
  import ExportCsvButton from '@dashboard-pages/search-pages/export-csv-button/ExportCsvButton.svelte'
  import { getRecentTransactions } from '@api/gateway'
  import PaginatedTable from '@components/_base/table/basic-table/PaginatedTable.svelte'
  import type { ComponentProps } from 'svelte'
  import { resourcesCacheClient } from '@api/utils/resource-cache-client'

  export let entityAddress: string

  const queryFunction = (cursor?: string) => {
    const uniqueNfts = new Set<string>()
    const uniqueFungibleTokens = new Set<string>()
    const uniqueIndividualNfts = new Set<NftGlobalId>()
    return getRecentTransactions(entityAddress, cursor)
      .then((res) => {
        res.items.forEach((transactionInfo) => {
          transactionInfo.balance_changes?.fungible_balance_changes?.forEach(
            (change) => {
              uniqueFungibleTokens.add(change.resource_address)
            }
          )

          transactionInfo.balance_changes?.non_fungible_balance_changes?.forEach(
            (change) => {
              uniqueNfts.add(change.resource_address)
              ;[...change.added, ...change.removed].forEach((id) => {
                uniqueIndividualNfts.add(`${change.resource_address}:${id}`)
              })
            }
          )
        })
        return res
      })
      .then((res) =>
        Promise.all([
          resourcesCacheClient.queryFungibles(Array.from(uniqueFungibleTokens)),
          resourcesCacheClient.queryNonFungibles(Array.from(uniqueNfts)),
          resourcesCacheClient.queryNonFungiblesData(
            Array.from(uniqueIndividualNfts)
          )
        ]).then(() => res)
      )
  }

  const columns: ComponentProps<PaginatedTable<any>>['columns'] = [
    messageColumnDefinition,
    mobileHeaderColumnDefinition,
    dateAndTxIdColumnDefinition,
    getOtherBalanceChangesColumnDefinition({ entityAddress }),
    getFeeColumnDefinition({ alignment: 'right' }),
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
/>

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
