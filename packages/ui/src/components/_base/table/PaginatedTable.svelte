<script lang="ts">
  import { onMount } from 'svelte'
  import Table from './Table.svelte'
  import type { TableConfig, TablePage, Entry } from './types'
  import InfiniteScroll from '@components/infinite-scroll/InfiniteScroll.svelte'
  import Pagination from './Pagination.svelte'

  type T = $$Generic<Entry>

  export let config: TableConfig<T>
  export let queryFunction: (cursor?: string) => Promise<TablePage<T>>

  export let mode: 'infiniteScroll' | 'paginated' = 'infiniteScroll'

  let resolvedEntries: Awaited<typeof entries> = []
  let entries: Promise<T[]> = new Promise(() => {})

  $: entries.then((e) => {
    resolvedEntries = e
  })

  let nextCursor: string | undefined
  let previousCursor: string | undefined
  let isLoadingCursor: string | undefined = 'initial'

  const updateCursors = (data: TablePage<T>) => {
    nextCursor = data.next_cursor ?? undefined
    previousCursor = data.previous_cursor ?? undefined
  }

  const getUpdatedEntries = (data: TablePage<T>) => {
    updateCursors(data)
    return data.items
  }

  onMount(() => {
    entries = queryFunction().then((data) => {
      isLoadingCursor = undefined
      return [...resolvedEntries, ...getUpdatedEntries(data)]
    })
  })

  const fetchMore = () => {
    if (nextCursor === isLoadingCursor || !nextCursor) {
      return
    }
    isLoadingCursor = nextCursor
    entries = queryFunction(nextCursor).then((data) => {
      isLoadingCursor = undefined
      return [...resolvedEntries, ...getUpdatedEntries(data)]
    })
  }

  const nextPage = () => {
    isLoadingCursor = nextCursor
    entries = queryFunction(nextCursor).then((data) => {
      isLoadingCursor = undefined
      return getUpdatedEntries(data)
    })
  }

  const previousPage = () => {
    isLoadingCursor = previousCursor
    entries = queryFunction(previousCursor).then((data) => {
      isLoadingCursor = undefined
      return getUpdatedEntries(data)
    })
  }
</script>

<Table {config} {entries} />

{#if mode === 'infiniteScroll'}
  <InfiniteScroll
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
