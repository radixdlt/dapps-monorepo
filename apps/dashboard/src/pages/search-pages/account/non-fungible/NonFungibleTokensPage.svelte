<script lang="ts">
  import { SkeletonLoader } from '@aleworm/svelte-skeleton-loader'
  import {
    getNonFungiblesIdsPageWithData,
    type GetNonFungibleIdsPageWithDataRequest
  } from '@api/gateway'
  import {
    transformNft,
    type TransformedNonFungible,
    type NonFungible
  } from '@api/utils/entities/resource'
  import NFTAccordion from '@components/_base/accordion/NFTAccordion.svelte'
  import InfiniteScroll from '@components/infinite-scroll/InfiniteScroll.svelte'
  import NonFungibleTokenCard from '@components/non-fungible-token-card/NonFungibleTokenCard.svelte'
  import { createEventDispatcher } from 'svelte'

  export let nonFungibleResources: Promise<TransformedNonFungible[]>

  export let stateVersion: Promise<number>
  export let accountAddress: Promise<string>

  const loadedLaterNfts: Record<string, NonFungible[]> = {}
  let isLoading = false

  let currentCursor: string | null | undefined = null

  $: data = Promise.all([stateVersion, accountAddress])

  let width: number

  const dispatch = createEventDispatcher<{
    'click-nft': { address: string }
  }>()

  const fetchMore = (data: GetNonFungibleIdsPageWithDataRequest) => {
    if (isLoading || currentCursor === undefined) {
      return
    }
    isLoading = true

    getNonFungiblesIdsPageWithData({
      ...data,
      cursor: currentCursor || data.cursor
    }).then(([response, nftDataResponse]) => {
      currentCursor = response.next_cursor
      if (!loadedLaterNfts[data.resourceAddress]) {
        loadedLaterNfts[data.resourceAddress] = []
      }
      loadedLaterNfts[data.resourceAddress].push(
        ...nftDataResponse.map((singleNftData) =>
          transformNft(data.resourceAddress, singleNftData)
        )
      )
      isLoading = false
    })
  }
</script>

{#await nonFungibleResources}
  {#each Array(3) as _}
    <NFTAccordion data={new Promise(() => {})} />
  {/each}
{:then nonFungibleResources}
  {#each nonFungibleResources as { resource, nonFungibles, ownedNonFungibles, nextCursor, vaultAddress }}
    <NFTAccordion
      data={{
        name: resource.metadata.standard.name?.value,
        address: resource.address,
        imageUrl: resource.metadata.standard.iconUrl?.value,
        count: ownedNonFungibles,
        tags: resource.metadata.standard.tags?.value,
        totalCount: Number(resource.totalSupply)
      }}
    >
      {#await data then [stateVersion, accountAddress]}
        <div bind:clientWidth={width}>
          <div class="nft-cards" class:center={width < 500}>
            {#each nonFungibles as { address, nftData: { standard: { iconUrl, name } } }}
              <NonFungibleTokenCard
                imgUrl={iconUrl}
                {name}
                {address}
                on:click={() =>
                  dispatch('click-nft', {
                    address: address.nonFungibleAddress
                  })}
              />
            {/each}
            {#if loadedLaterNfts[resource.address]}
              {#each loadedLaterNfts[resource.address] as { address, nftData: { standard: { iconUrl, name } } }}
                <NonFungibleTokenCard
                  imgUrl={iconUrl}
                  {name}
                  {address}
                  on:click={() =>
                    dispatch('click-nft', {
                      address: address.nonFungibleAddress
                    })}
                />
              {/each}
            {/if}
          </div>
        </div>

        <InfiniteScroll
          on:thresholdReached={() => {
            fetchMore({
              stateVersion,
              componentAddress: accountAddress,
              cursor: nextCursor,
              vaultAddress,
              resourceAddress: resource.address
            })
          }}
        />
        {#if isLoading}
          <div class="loader-spacing">
            <SkeletonLoader />
          </div>
        {/if}
      {/await}
    </NFTAccordion>
  {/each}
{/await}

<style>
  .nft-cards {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-2xl);
  }

  .center {
    display: flex;
    justify-content: center;
  }

  .loader-spacing {
    margin: var(--space-lg) auto;
  }
</style>
