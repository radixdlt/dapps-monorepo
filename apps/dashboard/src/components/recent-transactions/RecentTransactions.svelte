<script lang="ts">
  import type { NftGlobalId } from '@api/utils/entities/resource'

  import FeeColumn from './FeeColumn.svelte'

  import MobileHeaderColumn from './MobileHeaderColumn.svelte'

  import { goto } from '$app/navigation'
  import OtherBalanceChangesColumn from './OtherBalanceChangesColumn.svelte'
  import IconNew from '@components/_base/icon/IconNew.svelte'
  import type { CommittedTransactionInfo } from '@common/gateway-sdk'

  import TxMessageColumn from './TxMessageColumn.svelte'
  import BalanceChangesColumn from './BalanceChangesColumn.svelte'
  import ChevronRight from '@icons/chevron-right.svg'
  import ExportCsvButton from '@dashboard-pages/search-pages/export-csv-button/ExportCsvButton.svelte'
  import { getRecentTransactions } from '@api/gateway'
  import DateAndTxIdColumn from './DateAndTxIdColumn.svelte'
  import PaginatedTable from '@components/_base/table/basic-table/PaginatedTable.svelte'
  import type { ComponentProps } from 'svelte'
  import { resourcesCacheClient } from '@api/utils/resource-cache-client'

  type T = $$Generic

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
    {
      id: 'message',
      width: '60px',
      hideMobile: true,
      component: TxMessageColumn,
      componentProps: {
        message: (tx: CommittedTransactionInfo) => {
          const message: string = (tx?.message as any)?.content?.value
          return message
        }
      }
    },
    {
      id: 'mobile-header',
      hideDesktop: true,
      component: MobileHeaderColumn,
      componentProps: {
        message: (tx: CommittedTransactionInfo) => {
          const message: string = (tx?.message as any)?.content?.value
          return message
        },
        id: '$$intent_hash',
        date: '$$confirmed_at'
      }
    },
    {
      id: 'date-and-tx-id',
      hideMobile: true,
      width: '140px',
      header: {
        label: 'ID/DATE (GMT +00)'
      },
      component: DateAndTxIdColumn,
      componentProps: {
        id: '$$intent_hash',
        date: '$$confirmed_at'
      }
    },
    {
      id: 'other-balance-changes',
      width: '160px',
      header: {
        label: 'Other Balance Changes'
      },
      component: OtherBalanceChangesColumn,
      componentProps: {
        entityAddress,
        balanceChanges: '$$balance_changes'
      }
    },
    {
      id: 'fee',
      width: '160px',
      alignment: 'right',
      header: {
        label: 'Transaction Fee'
      },
      component: FeeColumn,
      componentProps: {
        fee: '$$fee_paid'
      }
    },
    {
      id: 'balance-increases',
      header: {
        label: 'Balance Increases'
      },
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
      alignment: 'right',
      component: BalanceChangesColumn,
      componentProps: {
        entityAddress,
        type: 'decreases',
        balanceChanges: '$$balance_changes'
      }
    },
    {
      id: 'chevron',
      hideMobile: true,
      component: IconNew,
      width: '50px',
      componentProps: {
        icon: ChevronRight,
        centered: true
      }
    }
  ]

  const config = {
    onRowClick: (row: any) => {
      goto(`/transaction/${row.intent_hash}/summary`)
    }
  }
</script>

<div class="export-button">
  <ExportCsvButton {entityAddress} />
</div>

<PaginatedTable
  --table-row-cell-vertical-padding="25px"
  {config}
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
