<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import type { PageData } from './$types'
  import Table from '@components/_base/table/Table.svelte'
  import InfiniteScroll from '@components/infinite-scroll/InfiniteScroll.svelte'
  import type { TableConfig } from '@components/_base/table/types'
  import DateAndTxIdColumn from './DateAndTxIdColumn.svelte'
  import { getRecentTransactions } from '@api/gateway'

  export let data: PageData

  let entries: any[] = []
  let isLoadingData = true
  let loadingCursor: string | null | undefined = null
  let nextCursor: string | null | undefined = null

  data.promises.transactionList.then((data) => {
    isLoadingData = false
    nextCursor = data.next_cursor
    entries = [...data.items]
  })

  const fetchMore = () => {
    if (nextCursor && loadingCursor !== nextCursor) {
      isLoadingData = true
      loadingCursor = nextCursor
      getRecentTransactions(data.account, nextCursor).then((data) => {
        isLoadingData = false
        loadingCursor = null
        nextCursor = data.next_cursor
        entries = [...entries, ...data.items]
      })
    }
  }

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

<Table {config} {entries} />

{#if isLoadingData}
  <div class="loading-wrapper">
    <SkeletonLoader />
  </div>
{/if}

<InfiniteScroll
  on:thresholdReached={() => {
    fetchMore()
  }}
/>

<style lang="scss">
  .loading-wrapper {
    margin-bottom: var(--space-lg);
  }
</style>
