<script lang="ts">
  import type { TablePage } from '../Table.svelte'

  import BasicTable, { type BasicTableColumn } from './BasicTable.svelte'

  import { onMount } from 'svelte'
  import { SkeletonLoader } from '@radixdlt/svelte-skeleton-loader'
  import InfiniteScroll from '@components/infinite-scroll/InfiniteScroll.svelte'
  import Pagination from './Pagination.svelte'

  type T = $$Generic<Entry>

  export let columns: (BasicTableColumn<T> | null)[]
  export let queryFunction: (cursor?: string) => Promise<TablePage<T>>

  export let mode: 'infiniteScroll' | 'paginated' = 'infiniteScroll'

  let entries: T[] = []

  let nextCursor: string | undefined
  let previousCursor: string | undefined
  let isLoadingCursor: string | undefined = 'initial'

  const updateCursors = (data: TablePage<T>) => {
    nextCursor = data.next_cursor ?? undefined
    previousCursor = data.previous_cursor ?? undefined
  }

  const updateEntries = (data: TablePage<T>) => {
    updateCursors(data)
    entries = [...entries, ...data.items]
  }

  const replaceEntries = (data: TablePage<T>) => {
    updateCursors(data)
    entries = data.items
  }

  onMount(() => {
    queryFunction().then((data) => {
      isLoadingCursor = undefined
      updateEntries(data)
    })
  })

  const fetchMore = () => {
    if (nextCursor === isLoadingCursor || !nextCursor) {
      return
    }
    isLoadingCursor = nextCursor
    queryFunction(nextCursor).then((data) => {
      isLoadingCursor = undefined
      updateEntries(data)
    })
  }

  const nextPage = () => {
    isLoadingCursor = nextCursor
    queryFunction(nextCursor).then((data) => {
      isLoadingCursor = undefined
      replaceEntries(data)
    })
  }

  const previousPage = () => {
    isLoadingCursor = previousCursor
    queryFunction(previousCursor).then((data) => {
      isLoadingCursor = undefined
      replaceEntries(data)
    })
  }
</script>

<BasicTable {columns} {entries} />

{#if isLoadingCursor && mode === 'infiniteScroll'}
  <div class="bottom-space">
    <SkeletonLoader />
  </div>
{/if}

{#if mode === 'infiniteScroll'}
  <InfiniteScroll
    on:noScrollableParent={() => {
      fetchMore()
    }}
    on:thresholdReached={() => {
      fetchMore()
    }}
  />
{/if}

{#if mode === 'paginated'}
  <div class="bottom-space">
    <Pagination
      disabledNext={!nextCursor || isLoadingCursor === nextCursor}
      disabledPrevious={!previousCursor || isLoadingCursor === previousCursor}
      on:next={nextPage}
      on:previous={previousPage}
    />
  </div>
{/if}

<style lang="scss">
  .bottom-space {
    margin-bottom: var(--space-lg);
  }
</style>
