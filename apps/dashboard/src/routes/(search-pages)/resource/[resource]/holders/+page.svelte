<script lang="ts">
  import Row from '@components/info-box/Row.svelte'
  import Link from '@components/_base/link/Link.svelte'
  import type { PageData } from './$types'
  import LoadingSpinner from '@components/_base/button/loading-spinner/LoadingSpinner.svelte'
  import { formatTokenValue } from '@utils'
  import type { ResourceHoldersCollectionItem } from '@common/gateway-sdk'
  import { callApi } from '@api/gateway'
  import InfiniteScroll from '@components/infinite-scroll/InfiniteScroll.svelte'

  export let data: PageData

  let holders: ResourceHoldersCollectionItem[] = []

  data.holders.then(({ items }) => {
    holders = [...holders, ...items]
  })

  let cursor: string | undefined

  data.holders.then((holders) => (cursor = holders.next_cursor ?? undefined))

  const loadMore = async () => {
    if (!cursor) return

    callApi(
      'getResourceHolders',
      data.resource.address,
      cursor ?? undefined
    ).map((result) => {
      cursor = result.next_cursor ?? undefined
      holders = [...holders, ...result.items]
    })
  }
</script>

<div class="card info-card">
  {#await data.holders}
    <div class="loading-container">
      <div class="loading">
        <LoadingSpinner />
      </div>
    </div>
  {:then _}
    {#each holders as holder}
      <Row>
        <div slot="left">
          <Link
            url="/account/{holder.holder_address}"
            text={holder.holder_address}
          />
        </div>

        <div slot="right">
          {holder.type === 'FungibleResource'
            ? formatTokenValue(holder.amount).displayValue
            : holder.non_fungible_ids_count}
        </div>
      </Row>
    {/each}

    <InfiniteScroll
      on:thresholdReached={() => {
        loadMore()
      }}
    />
  {/await}
</div>

<style>
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 100%;
    width: 100%;
  }

  .loading {
    height: 5rem;
    width: 5rem;
  }

  .pagination {
    margin-top: var(--spacing-lg);
  }
</style>
